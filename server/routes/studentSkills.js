import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireStudent } from '../middleware/auth.js';

const router = express.Router();

// Get student skills - Using JSONB skills field
router.get('/', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id, student_id } = req.user;

    // Use id as student_id if student_id is not present
    const profileId = student_id || id;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID not found in token'
      });
    }

    const result = await pool.query(
      `SELECT skills FROM students WHERE student_id = $1`,
      [profileId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    let skills = result.rows[0].skills || [];
    
    // Parse skills from JSONB if needed
    if (typeof skills === 'string') {
      try {
        skills = JSON.parse(skills);
      } catch (error) {
        console.error('Error parsing skills JSON:', error);
        skills = [];
      }
    }

    res.json({
      success: true,
      skills
    });

  } catch (error) {
    console.error('Student skills fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills'
    });
  }
});

// Add skill to student - Working with JSONB skills field
router.post('/', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id, student_id } = req.user;
    const { skill_name } = req.body;

    console.log('Debug - Add skill request:', { id, student_id, skill_name });

    if (!skill_name || skill_name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required'
      });
    }

    // Use id as student_id if student_id is not present
    const profileId = student_id || id;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID not found in token'
      });
    }

    // Get current skills
    const currentResult = await pool.query(
      `SELECT skills FROM students WHERE student_id = $1`,
      [profileId]
    );

    console.log('Debug - Current skills query result:', currentResult.rows);

    if (currentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    let currentSkills = currentResult.rows[0].skills || [];
    
    console.log('Debug - Current skills from DB:', currentSkills, typeof currentSkills);
    
    // Parse current skills if string
    if (typeof currentSkills === 'string') {
      try {
        currentSkills = JSON.parse(currentSkills);
      } catch (error) {
        currentSkills = [];
      }
    }

    // Ensure currentSkills is an array
    if (!Array.isArray(currentSkills)) {
      currentSkills = [];
    }

    console.log('Debug - Parsed current skills:', currentSkills);

    // Check if skill already exists
    const skillExists = currentSkills.some(skill => 
      skill.toLowerCase() === skill_name.trim().toLowerCase()
    );

    if (skillExists) {
      return res.status(400).json({
        success: false,
        message: 'Skill already exists'
      });
    }

    // Add new skill
    const updatedSkills = [...currentSkills, skill_name.trim()];

    console.log('Debug - Updated skills array:', updatedSkills);

    // Update in database
    const updateResult = await pool.query(
      `UPDATE students 
       SET skills = $1
       WHERE student_id = $2`,
      [JSON.stringify(updatedSkills), profileId]
    );

    console.log('Debug - Update result:', updateResult.rowCount, 'rows affected');

    res.json({
      success: true,
      message: 'Skill added successfully',
      skills: updatedSkills
    });

  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add skill'
    });
  }
});

// Remove skill from student - Working with JSONB skills field
router.delete('/:skillName', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { id, student_id } = req.user;
    const { skillName } = req.params;

    if (!skillName) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required'
      });
    }

    // Use id as student_id if student_id is not present
    const profileId = student_id || id;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID not found in token'
      });
    }

    // Get current skills
    const currentResult = await pool.query(
      `SELECT skills FROM students WHERE student_id = $1`,
      [profileId]
    );

    if (currentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    let currentSkills = currentResult.rows[0].skills || [];
    
    // Parse current skills if string
    if (typeof currentSkills === 'string') {
      try {
        currentSkills = JSON.parse(currentSkills);
      } catch (error) {
        currentSkills = [];
      }
    }

    // Remove the skill
    const updatedSkills = currentSkills.filter(skill => 
      skill.toLowerCase() !== decodeURIComponent(skillName).toLowerCase()
    );

    // Update in database
    await pool.query(
      `UPDATE students 
       SET skills = $1
       WHERE student_id = $2`,
      [JSON.stringify(updatedSkills), profileId]
    );

    res.json({
      success: true,
      message: 'Skill removed successfully',
      skills: updatedSkills
    });

  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove skill'
    });
  }
});

export default router;