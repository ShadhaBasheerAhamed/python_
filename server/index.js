import express from 'express';
import cors from 'cors';
import { getDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 1. Student Login / Identification Route
app.post('/api/students/login', async (req, res) => {
  try {
    const { grade, section, name } = req.body;
    if (!grade || !section || !name || !name.trim()) {
      return res.status(400).json({ error: 'Grade, Section and Name are required.' });
    }

    const cleanName = name.trim();
    const profileKey = `${grade}-${section}-${cleanName.toLowerCase()}`;
    const db = await getDb();

    let student = await db.get('SELECT * FROM students WHERE profile_key = ?', [profileKey]);

    const todayStr = new Date().toISOString().split('T')[0];

    if (!student) {
      // Create new student profile
      const result = await db.run(
        `INSERT INTO students (name, grade, section, profile_key, current_level, xp, stars, streak, last_activity_date, badges_json)
         VALUES (?, ?, ?, ?, 1, 0, 0, 1, ?, '["python_starter"]')`,
        [cleanName, grade, section, profileKey, todayStr]
      );

      const studentId = result.lastID;

      // Initialize Level 1 progress
      await db.run(
        `INSERT INTO progress (student_id, level_id, topic, status, stars, score)
         VALUES (?, 1, 'Python Introduction', 'unlocked', 0, 0)`,
        [studentId]
      );

      // Award initial starter badge
      await db.run(
        `INSERT INTO badges (student_id, badge_key, badge_name)
         VALUES (?, 'python_starter', '🐍 Python Starter')`,
        [studentId]
      );

      student = await db.get('SELECT * FROM students WHERE id = ?', [studentId]);
    } else {
      // Calculate streak for returning student
      let newStreak = student.streak || 1;
      if (student.last_activity_date) {
        const lastDate = new Date(student.last_activity_date);
        const today = new Date(todayStr);
        const diffDays = Math.round((today - lastDate) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      }

      await db.run(
        'UPDATE students SET streak = ?, last_activity_date = ? WHERE id = ?',
        [newStreak, todayStr, student.id]
      );
      student.streak = newStreak;
      student.last_activity_date = todayStr;
    }

    // Fetch progress and badges
    const progressList = await db.all('SELECT * FROM progress WHERE student_id = ?', [student.id]);
    const badgesList = await db.all('SELECT * FROM badges WHERE student_id = ?', [student.id]);

    res.json({
      isReturning: !!student.id,
      student,
      progress: progressList,
      badges: badgesList
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database server error' });
  }
});

// 2. Fetch Complete Student Details
app.get('/api/students/:id', async (req, res) => {
  try {
    const db = await getDb();
    const student = await db.get('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const progress = await db.all('SELECT * FROM progress WHERE student_id = ?', [student.id]);
    const badges = await db.all('SELECT * FROM badges WHERE student_id = ?', [student.id]);
    const attempts = await db.all('SELECT * FROM attempts WHERE student_id = ?', [student.id]);

    res.json({ student, progress, badges, attempts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Update Focus Loss Event
app.post('/api/students/focus-lost', async (req, res) => {
  try {
    const { student_id } = req.body;
    const db = await getDb();
    await db.run('UPDATE students SET focus_interruptions = focus_interruptions + 1 WHERE id = ?', [student_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Record Activity Attempt
app.post('/api/attempts/record', async (req, res) => {
  try {
    const { student_id, activity_id, level_id, topic, is_correct, time_taken } = req.body;
    const db = await getDb();

    await db.run(
      `INSERT INTO attempts (student_id, activity_id, level_id, topic, is_correct, time_taken)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [student_id, activity_id, level_id, topic, is_correct ? 1 : 0, time_taken || 0]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Complete Level & Reward Progression
app.post('/api/progress/complete-level', async (req, res) => {
  try {
    const { student_id, level_id, stars, xp_earned, score, topic } = req.body;
    const db = await getDb();

    const todayStr = new Date().toISOString().split('T')[0];

    // Check or insert progress row
    const existing = await db.get(
      'SELECT * FROM progress WHERE student_id = ? AND level_id = ?',
      [student_id, level_id]
    );

    if (existing) {
      await db.run(
        `UPDATE progress SET status = 'completed', stars = MAX(stars, ?), score = MAX(score, ?), attempts = attempts + 1, completed_at = ?
         WHERE student_id = ? AND level_id = ?`,
        [stars, score, todayStr, student_id, level_id]
      );
    } else {
      await db.run(
        `INSERT INTO progress (student_id, level_id, topic, status, stars, score, attempts, completed_at)
         VALUES (?, ?, ?, 'completed', ?, ?, 1, ?)`,
        [student_id, level_id, topic || `Level ${level_id}`, stars, score, todayStr]
      );
    }

    // Unlock Next Level automatically
    const nextLevelId = level_id + 1;
    const existingNext = await db.get(
      'SELECT * FROM progress WHERE student_id = ? AND level_id = ?',
      [student_id, nextLevelId]
    );

    if (!existingNext) {
      await db.run(
        `INSERT INTO progress (student_id, level_id, topic, status, stars, score)
         VALUES (?, ?, ?, 'unlocked', 0, 0)`,
        [student_id, nextLevelId, `Level ${nextLevelId}`]
      );
    } else if (existingNext.status === 'locked') {
      await db.run(
        `UPDATE progress SET status = 'unlocked' WHERE student_id = ? AND level_id = ?`,
        [student_id, nextLevelId]
      );
    }

    // Update Student total XP, current_level, stars
    const currentStudent = await db.get('SELECT * FROM students WHERE id = ?', [student_id]);
    const updatedXP = (currentStudent.xp || 0) + (xp_earned || 0);
    const updatedStars = (currentStudent.stars || 0) + (stars || 0);
    const newCurrentLevel = Math.max(currentStudent.current_level || 1, nextLevelId);

    await db.run(
      `UPDATE students SET xp = ?, stars = ?, current_level = ? WHERE id = ?`,
      [updatedXP, updatedStars, newCurrentLevel, student_id]
    );

    // Evaluate Milestone Badges
    const earnedBadges = [];

    // Helper badge granter
    const checkBadge = async (key, name) => {
      try {
        await db.run(
          `INSERT INTO badges (student_id, badge_key, badge_name) VALUES (?, ?, ?)`,
          [student_id, key, name]
        );
        earnedBadges.push({ badge_key: key, badge_name: name });
      } catch (e) {
        // Unique constraint error if already earned, ignore
      }
    };

    if (level_id >= 3) await checkBadge('variable_master', '🎁 Variable Master');
    if (level_id >= 7) await checkBadge('logic_thinker', '💡 Logic Thinker');
    if (level_id >= 9) await checkBadge('loop_runner', '🔁 Loop Master');
    if (level_id >= 14) await checkBadge('list_explorer', '📦 List Explorer');
    if (updatedXP >= 1000) await checkBadge('python_champion', '🚀 Python Champion');

    const updatedStudent = await db.get('SELECT * FROM students WHERE id = ?', [student_id]);
    const updatedProgress = await db.all('SELECT * FROM progress WHERE student_id = ?', [student_id]);
    const updatedBadgesList = await db.all('SELECT * FROM badges WHERE student_id = ?', [student_id]);

    res.json({
      student: updatedStudent,
      progress: updatedProgress,
      badges: updatedBadgesList,
      newBadgesEarned: earnedBadges
    });
  } catch (err) {
    console.error('Complete level error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Leaderboard Route
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { grade, section } = req.query;
    const db = await getDb();

    let query = 'SELECT id, name, grade, section, current_level, xp, stars, streak FROM students';
    const params = [];
    const conditions = [];

    if (grade && grade !== 'All') {
      conditions.push('grade = ?');
      params.push(grade);
    }
    if (section && section !== 'All') {
      conditions.push('section = ?');
      params.push(section);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY xp DESC, current_level DESC LIMIT 50';

    const leaderboard = await db.all(query, params);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Teacher Authentication (PIN: 0626)
app.post('/api/teacher/login', (req, res) => {
  const { pin } = req.body;
  if (pin === '0626') {
    return res.json({ success: true, token: 'teacher-auth-secret-0626' });
  }
  res.status(401).json({ error: 'Invalid Teacher PIN. Access Denied.' });
});

// 8. Teacher Overview Metrics
app.get('/api/teacher/overview', async (req, res) => {
  try {
    const db = await getDb();
    const students = await db.all('SELECT * FROM students');
    const totalStudents = students.length;

    let activeStudents = 0;
    let totalXp = 0;
    let totalLevels = 0;

    const today = new Date().toISOString().split('T')[0];

    students.forEach(s => {
      totalXp += s.xp || 0;
      totalLevels += s.current_level || 1;
      if (s.last_activity_date === today) activeStudents++;
    });

    const avgXp = totalStudents > 0 ? Math.round(totalXp / totalStudents) : 0;
    const avgLevel = totalStudents > 0 ? (totalLevels / totalStudents).toFixed(1) : 1;

    // Calculate accuracy across all attempts
    const attempts = await db.all('SELECT is_correct FROM attempts');
    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter(a => a.is_correct === 1).length;
    const avgAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;

    // Students needing support (students with > 3 attempts and accuracy < 60%)
    const studentAttempts = await db.all(
      `SELECT student_id, COUNT(*) as total, SUM(is_correct) as correct
       FROM attempts GROUP BY student_id`
    );

    const strugglingIds = studentAttempts
      .filter(sa => sa.total >= 3 && (sa.correct / sa.total) < 0.6)
      .map(sa => sa.student_id);

    res.json({
      totalStudents,
      activeStudents,
      avgXp,
      avgLevel,
      avgAccuracy,
      needingSupportCount: strugglingIds.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Teacher Student Directory
app.get('/api/teacher/students', async (req, res) => {
  try {
    const { grade, section, search } = req.query;
    const db = await getDb();

    let query = `
      SELECT s.*, 
             COUNT(DISTINCT p.level_id) as levels_completed,
             (SELECT COUNT(*) FROM attempts a WHERE a.student_id = s.id) as total_attempts,
             (SELECT COUNT(*) FROM attempts a WHERE a.student_id = s.id AND a.is_correct = 1) as correct_attempts
      FROM students s
      LEFT JOIN progress p ON s.id = p.student_id AND p.status = 'completed'
    `;

    const conditions = [];
    const params = [];

    if (grade && grade !== 'All') {
      conditions.push('s.grade = ?');
      params.push(grade);
    }
    if (section && section !== 'All') {
      conditions.push('s.section = ?');
      params.push(section);
    }
    if (search && search.trim()) {
      conditions.push('s.name LIKE ?');
      params.push(`%${search.trim()}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY s.id ORDER BY s.name ASC';

    const students = await db.all(query, params);

    const formatted = students.map(s => {
      const accuracy = s.total_attempts > 0
        ? Math.round((s.correct_attempts / s.total_attempts) * 100)
        : 100;

      return {
        ...s,
        accuracy
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Teacher Student Detail View
app.get('/api/teacher/students/:id', async (req, res) => {
  try {
    const db = await getDb();
    const student = await db.get('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const progress = await db.all('SELECT * FROM progress WHERE student_id = ?', [student.id]);
    const badges = await db.all('SELECT * FROM badges WHERE student_id = ?', [student.id]);
    const attempts = await db.all(
      'SELECT * FROM attempts WHERE student_id = ? ORDER BY created_at DESC LIMIT 30',
      [student.id]
    );

    // Topic performance accuracy breakdown
    const topicStats = await db.all(
      `SELECT topic, COUNT(*) as total, SUM(is_correct) as correct
       FROM attempts WHERE student_id = ? GROUP BY topic`,
      [student.id]
    );

    res.json({
      student,
      progress,
      badges,
      attempts,
      topicStats: topicStats.map(t => ({
        topic: t.topic,
        accuracy: Math.round((t.correct / t.total) * 100),
        total: t.total
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Teacher Controls (Reset level, Add/Remove XP, Lock/Unlock level)
app.post('/api/teacher/student-action', async (req, res) => {
  try {
    const { action, student_id, amount, level_id } = req.body;
    const db = await getDb();

    if (action === 'reset_level') {
      await db.run('UPDATE students SET current_level = 1 WHERE id = ?', [student_id]);
      await db.run("UPDATE progress SET status = 'locked', stars = 0, score = 0 WHERE student_id = ? AND level_id > 1", [student_id]);
      await db.run("UPDATE progress SET status = 'unlocked' WHERE student_id = ? AND level_id = 1", [student_id]);
    } else if (action === 'add_xp') {
      await db.run('UPDATE students SET xp = xp + ? WHERE id = ?', [amount || 50, student_id]);
    } else if (action === 'remove_xp') {
      await db.run('UPDATE students SET xp = MAX(0, xp - ?) WHERE id = ?', [amount || 50, student_id]);
    } else if (action === 'unlock_level') {
      await db.run(
        `INSERT INTO progress (student_id, level_id, topic, status) VALUES (?, ?, 'Unlocked', 'unlocked')
         ON CONFLICT(student_id, level_id) DO UPDATE SET status = 'unlocked'`,
        [student_id, level_id]
      );
    } else if (action === 'lock_level') {
      await db.run(
        `UPDATE progress SET status = 'locked' WHERE student_id = ? AND level_id = ?`,
        [student_id, level_id]
      );
    }

    const updatedStudent = await db.get('SELECT * FROM students WHERE id = ?', [student_id]);
    res.json({ success: true, student: updatedStudent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Teacher Topic Analytics
app.get('/api/teacher/topic-analytics', async (req, res) => {
  try {
    const db = await getDb();
    const topicData = await db.all(`
      SELECT topic, 
             COUNT(*) as total_attempts,
             SUM(is_correct) as correct_attempts,
             COUNT(DISTINCT student_id) as total_students
      FROM attempts
      GROUP BY topic
    `);

    const formatted = topicData.map(t => {
      const accuracy = Math.round((t.correct_attempts / t.total_attempts) * 100);
      return {
        topic: t.topic,
        accuracy,
        totalAttempts: t.total_attempts,
        struggling: accuracy < 65 ? Math.ceil(t.total_students * 0.4) : Math.floor(t.total_students * 0.1),
        mastered: accuracy >= 65 ? Math.ceil(t.total_students * 0.7) : Math.floor(t.total_students * 0.3)
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13. CSV Export Route
app.get('/api/teacher/export-csv', async (req, res) => {
  try {
    const db = await getDb();
    const students = await db.all(`
      SELECT s.*,
             (SELECT COUNT(*) FROM attempts a WHERE a.student_id = s.id) as total_attempts,
             (SELECT COUNT(*) FROM attempts a WHERE a.student_id = s.id AND a.is_correct = 1) as correct_attempts
      FROM students s ORDER BY s.grade, s.section, s.name
    `);

    let csvContent = 'Student ID,Name,Grade,Section,Current Level,XP,Stars,Streak,Accuracy %,Focus Interruptions,Last Active\n';

    students.forEach(s => {
      const accuracy = s.total_attempts > 0
        ? Math.round((s.correct_attempts / s.total_attempts) * 100)
        : 100;
      csvContent += `"${s.id}","${s.name}","${s.grade}","${s.section}","${s.current_level}","${s.xp}","${s.stars}","${s.streak}","${accuracy}%","${s.focus_interruptions || 0}","${s.last_activity_date || ''}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="python_quest_students_report.csv"');
    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🐍 Python Quest Express Backend running on http://localhost:${PORT}`);
});
