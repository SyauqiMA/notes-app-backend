const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title = 'untitled', tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    return { error: false, message: 'Catatan berhasil ditambahkan' };
  }

  const response = h.response({ error: true, message: 'Catatan gagal ditambahkan' });
  response.code(400);
  return response;
};

const getAllNotesHandler = () => notes;

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return note;
  }

  const response = h.response({ error: true, message: 'Catatan tidak ditemukan' });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    return { error: false, message: 'Catatan berhasil diperbarui' };
  }

  const response = h.response({ error: true, message: 'Gagal memperbarui catatan. Id tidak ditemukan' });
  response.status(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    return { error: false, message: 'Catatan berhasil dihapus' };
  }

  const response = h.response({ error: true, message: 'Catatan gagal dihapus. Id tidak ditemukan' });
  response.status(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
