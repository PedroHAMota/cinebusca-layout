// src/components/MovieDetailsModal.jsx
import { Modal } from 'react-bootstrap';
import { Star } from 'lucide-react';

function MovieDetailsModal({ movie, show, onHide }) {
  if (!movie) return null;

  const {
    title,
    overview,
    release_date,
    vote_average,
    genres,
    runtime,
    budget,
    revenue,
    production_companies,
    poster_path
  } = movie;

  const formatCurrency = (value) =>
    value ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A';

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do Filme</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column flex-md-row gap-4">
        <img
          src={poster_path || '/fallback.jpg'}
          alt={title}
          className="rounded shadow"
          style={{ width: '200px', height: '300px', objectFit: 'cover' }}
        />
        <div>
          <h4 className="fw-bold">{title}</h4>
          <p><strong>Sinopse:</strong> {overview || 'Sem sinopse disponível.'}</p>
          <p><strong>Lançamento:</strong> {new Date(release_date).toLocaleDateString('pt-BR')}</p>
          <p><strong>Avaliação:</strong> <Star size={14} className="text-warning me-1" /> {vote_average?.toFixed(1) || 'N/A'}</p>
          <p><strong>Gêneros:</strong> {genres?.map(g => g.name).join(', ') || 'N/A'}</p>
          <p><strong>Duração:</strong> {runtime ? `${runtime} minutos` : 'N/A'}</p>
          <p><strong>Produção:</strong> {production_companies?.map(p => p.name).join(', ') || 'N/A'}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>Fechar</button>
      </Modal.Footer>
    </Modal>
  );
}

export default MovieDetailsModal;
