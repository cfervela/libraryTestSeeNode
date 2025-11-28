const pool = require('../db/conexion');

// Obtener todos los libros
async function getAllBooks() {
    const [rows] = await pool.query('SELECT * FROM books');
    return rows;
}

// Obtener un libro por ID
async function getBookById(id) {
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0]; // solo uno
}

// Insertar nuevo libro
async function createBook(title, autor) {
    const [result] = await pool.query(
        'INSERT INTO books (title, autor) VALUES (?, ?)',
        [title,autor]
    );
    return result.insertId;
}

// Actualizar libro existente
async function updateBook(id, title, autor) {
    const [result] = await pool.query(
        'UPDATE books SET title = ?, autor = ? WHERE id = ?',
        [title, autor, id]
    );
    return result.affectedRows;
}

// Eliminar libro
async function deleteBook(id) {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows;
}

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};