// controllers/booksController.js
const BookModel = require('../model/BookModel');

// GET /api/books
const getBooks = async (req, res) => {
    try {
        const books = await BookModel.getAllBooks();
        res.json(books);
    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).json({ mensaje: 'Error al obtener libros' });
    }
};

// GET /api/books/:id
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await BookModel.getBookById(id);
        if (!book)
        return res.status(404).json({ mensaje: 'Libro no encontrado' });
        res.json(book);
    } catch (error) {
        console.error('Error al obtener libro:', error);
        res.status(500).json({ mensaje: 'Error al obtener libro' });
    }
};

// POST /api/books
const createBook = async (req, res) => {
    try {
        console.log(req.body);
        const { title, autor } = req.body;
        if (!title || !autor)
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
        console.log("1");
        const id_insertado = await BookModel.createBook(title, autor);
        res.status(201).json({ mensaje: 'Libro agregado', id_insertado });
        console.log("2");
    } catch (error) {
        console.error('Error al agregar libro:', error);
        res.status(500).json({ mensaje: 'Error al agregar libro' });
    }
};

// PUT /api/books/:id
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, autor } = req.body;
        const filas = await BookModel.updateBook(id, title, autor);
        if (filas === 0)
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        res.json({ mensaje: 'Libro actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar libro:', error);
        res.status(500).json({ mensaje: 'Error al actualizar libro' });
    }
};

// DELETE /api/books/:id
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await BookModel.deleteBook(id);
        if (filas === 0)
            return res.status(404).json({ mensaje: 'Libro no encontrado' });
        res.json({ mensaje: 'Libro eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar libro:', error);
        res.status(500).json({ mensaje: 'Error al eliminar libro' });
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};