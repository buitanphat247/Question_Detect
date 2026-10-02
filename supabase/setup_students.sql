-- ============================================================================
-- SQL SCRIPT TẠO BẢNG & DANH SÁCH SINH VIÊN ĐÃ CẤP QUYỀN
-- Database: Supabase (aacpvpfkqhwlltwjjiag)
-- ============================================================================

CREATE TABLE IF NOT EXISTS students (
    student_id TEXT PRIMARY KEY,                 -- Mã sinh viên
    name TEXT DEFAULT '',                        -- Họ và tên sinh viên
    is_active BOOLEAN DEFAULT TRUE,              -- Trạng thái: TRUE = Hoạt động, FALSE = Khóa
    session_token TEXT DEFAULT '',               -- Token phiên làm việc hiện tại
    last_login_at TIMESTAMPTZ DEFAULT NOW(),     -- Thời gian đăng nhập gần nhất
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- Danh sách MSV đã cấp quyền
INSERT INTO students (student_id, name, is_active)
VALUES 
    ('25110153', 'Sinh Viên 25110153', TRUE),
    ('25110227', 'Sinh Viên 25110227', TRUE),
    ('25110288', 'Sinh Viên 25110288', TRUE),
    ('25110283', 'Sinh Viên 25110283', TRUE),
    ('25110371', 'Sinh Viên 25110371', TRUE),
    ('25110372', 'Sinh Viên 25110372', TRUE),
    ('25110289', 'Sinh Viên 25110289', TRUE),
    ('25110361', 'Sinh Viên 25110361', TRUE),
    ('25110400', 'Sinh Viên 25110400', TRUE)
ON CONFLICT (student_id) DO UPDATE 
SET is_active = TRUE;
