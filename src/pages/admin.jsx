import axios from 'axios';
import { useEffect, useState } from 'react';
import './Admin.css';

export default function Admin() {
    const [turmas, setTurmas] = useState([]);
    const [turma, setTurma] = useState('');
    const [professor, setProfessor] = useState('');
    const [materia, setMateria] = useState('');
    const [data, setData] = useState('');
    const [sala, setSala] = useState('');
    const [periodo, setPeriodo] = useState('');
    const [horarioInicio, setHorarioInicio] = useState('');
    const [horarioFim, setHorarioFim] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [modalAberto, setModalAberto] = useState(false);
    const [turmaEditando, setTurmaEditando] = useState(null);
    const [excluindo, setExcluindo] = useState(false);

    // CORRIGIDO: Obter data correta sem voltar um dia
    const obterDataAtual = () => {
        const hoje = new Date();
        const dataBR = hoje.toLocaleDateString('pt-BR'); // DD/MM/YYYY correto
        const [dia, mes, ano] = dataBR.split('/');
        return `${ano}-${mes}-${dia}`; // YYYY-MM-DD sem UTC
    };

    const determinarPeriodo = () => {
        const agora = new Date();
        const horas = agora.getHours();

        if (horas < 12) return 'Matutino';
        if (horas < 19) return 'Vespertino';
        return 'Noturno';
    };

    useEffect(() => {
        fetchTurmas();
        setData(obterDataAtual());
    }, []);

    async function fetchTurmas() {
        try {
            setIsLoading(true);
            const periodoAtual = determinarPeriodo();
            const dataAtual = obterDataAtual();

            let endpoint = '';

            switch (periodoAtual) {
                case 'Matutino':
                    endpoint = `/listar-manha/${dataAtual}`;
                    break;
                case 'Vespertino':
                    endpoint = `/listar-tarde/${dataAtual}`;
                    break;
                case 'Noturno':
                    endpoint = `/listar-noite/${dataAtual}`;
                    break;
                default:
                    endpoint = `/listar-manha/${dataAtual}`;
            }

            const response = await axios.get(`https://back-end-painel.onrender.com${endpoint}`);
            setTurmas(response.data);
        } catch (error) {
            console.error('Erro ao buscar aulas:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function addTurma(e) {
        e.preventDefault();
        setIsLoading(true);
        setMensagem('');
        
        if (!turma || !professor || !materia || !data || !sala || !periodo || !horarioInicio || !horarioFim) {
            setMensagem('Por favor, preencha todos os campos.');
            setIsLoading(false);
            return;
        }
        
        if (horarioInicio >= horarioFim) {
            setMensagem('O horário de início deve ser anterior ao horário de término.');
            setIsLoading(false);
            return;
        }

        try {
            const novaTurma = {
                turma,
                professor,
                materia,
                data,
                sala,
                periodo,
                horarioInicio,
                horarioFim
            };

            const response = await axios.post('https://back-end-painel.onrender.com/add', novaTurma);
            
            if (response.status === 201 || response.status === 200) {
                setMensagem('Turma adicionada com sucesso!');
                
                setTurma('');
                setProfessor('');
                setMateria('');
                setSala('');
                setPeriodo('');
                setHorarioInicio('');
                setHorarioFim('');
                
                fetchTurmas();
            }
        } catch (error) {
            console.error('Erro ao adicionar turma:', error);
            setMensagem('Erro ao adicionar turma. Verifique os dados e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }

    // Formatar exibição DD/MM/YYYY
    const formatarDataExibicao = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    const abrirModalEdicao = (turma) => {
        setTurmaEditando({
            ...turma,
            data: turma.data ? new Date(turma.data).toISOString().split('T')[0] : obterDataAtual()
        });
        setModalAberto(true);
        setExcluindo(false);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setTurmaEditando(null);
        setExcluindo(false);
    };

    const salvarEdicao = async () => {
        if (!turmaEditando.turma || !turmaEditando.professor || !turmaEditando.materia || 
            !turmaEditando.data || !turmaEditando.sala || !turmaEditando.periodo || 
            !turmaEditando.horarioInicio || !turmaEditando.horarioFim) {
            setMensagem('Por favor, preencha todos os campos.');
            return;
        }
        
        if (turmaEditando.horarioInicio >= turmaEditando.horarioFim) {
            setMensagem('O horário de início deve ser anterior ao horário de término.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.put(`https://back-end-painel.onrender.com/atualizar/${turmaEditando._id || turmaEditando.id}`, turmaEditando);
            
            if (response.status === 200) {
                setMensagem('Turma atualizada com sucesso!');
                fecharModal();
                fetchTurmas();
            }
        } catch (error) {
            console.error('Erro ao atualizar turma:', error);
            setMensagem('Erro ao atualizar turma. Verifique os dados e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // FUNÇÃO EXCLUIR TURMA CORRIGIDA
    const excluirTurma = async () => {
        try {
            setIsLoading(true);
            const response = await axios.delete(`https://back-end-painel.onrender.com/deletar/${turmaEditando.id}`);
            
            if (response.status === 200 || response.status === 204) {
                // Fecha o modal primeiro
                fecharModal();
                // Depois mostra a mensagem de sucesso
                setMensagem('Turma excluída com sucesso!');
                // Atualiza a lista de turmas
                fetchTurmas();
            }
        } catch (error) {
            console.error('Erro ao excluir turma:', error);
            // Fecha o modal mesmo em caso de erro
            fecharModal();
            setMensagem('Erro ao excluir turma. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // FUNÇÃO PARA CONFIRMAR EXCLUSÃO
    const confirmarExclusao = () => {
        setExcluindo(true);
    };

    // FUNÇÃO PARA CANCELAR EXCLUSÃO
    const cancelarExclusao = () => {
        setExcluindo(false);
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Painel de Administração</h1>
                <p>Gerenciamento de Turmas e Horários</p>
            </header>
            
            <div className="admin-content">
                <div className="form-section">
                    <h2>Adicionar Nova Turma</h2>
                    
                    {mensagem && (
                        <div className={`message ${mensagem.includes('Erro') ? 'error' : 'success'}`}>
                            {mensagem}
                        </div>
                    )}
                    
                    <form onSubmit={addTurma} className="turma-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="turma">Turma *</label>
                                <input
                                    type="text"
                                    id="turma"
                                    value={turma}
                                    onChange={(e) => setTurma(e.target.value)}
                                    required
                                    placeholder="Turma"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="professor">Professor *</label>
                                <input
                                    type="text"
                                    id="professor"
                                    value={professor}
                                    onChange={(e) => setProfessor(e.target.value)}
                                    required
                                    placeholder="Nome do professor"
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="materia">Matéria *</label>
                                <input
                                    type="text"
                                    id="materia"
                                    value={materia}
                                    onChange={(e) => setMateria(e.target.value)}
                                    required
                                    placeholder="Nome da matéria"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="data">Data *</label>
                                <input
                                    type="date"
                                    id="data"
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="sala">Sala *</label>
                                <input
                                    type="text"
                                    id="sala"
                                    value={sala}
                                    onChange={(e) => setSala(e.target.value)}
                                    required
                                    placeholder="Número da sala"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="periodo">Período *</label>
                                <select
                                    id="periodo"
                                    value={periodo}
                                    onChange={(e) => setPeriodo(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione um período</option>
                                    <option value="Matutino">Manhã</option>
                                    <option value="Vespertino">Tarde</option>
                                    <option value="Noturno">Noite</option>
                                </select>   
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="horarioInicio">Horário de Início *</label>
                                <input
                                    type="time"
                                    id="horarioInicio"
                                    value={horarioInicio}
                                    onChange={(e) => setHorarioInicio(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="horarioFim">Horário de Término *</label>
                                <input
                                    type="time"
                                    id="horarioFim"
                                    value={horarioFim}
                                    onChange={(e) => setHorarioFim(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className={`submit-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Adicionando...
                                </>
                            ) : (
                                'Adicionar Turma'
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="turmas-list">
                    <h2>Turmas Cadastradas para Hoje</h2>
                    {isLoading ? (
                        <p className="empty-list">Carregando turmas...</p>
                    ) : turmas.length === 0 ? (
                        <p className="empty-list">Nenhuma turma cadastrada para hoje.</p>
                    ) : (
                        <div className="turmas-grid">
                            {turmas.map(turma => (
                                <div key={turma._id || turma.id} className="turma-card">
                                    <div className="turma-header">
                                        <h3>{turma.turma} - {turma.materia}</h3>
                                        <span className={`periodo-badge ${turma.periodo.toLowerCase()}`}>
                                            {turma.periodo}
                                        </span>
                                    </div>
                                    <div className="turma-details">
                                        <p><strong>Professor:</strong> {turma.professor}</p>
                                        <p><strong>Data:</strong> {formatarDataExibicao(turma.data)}</p>
                                        <p><strong>Sala:</strong> {turma.sala}</p>
                                        <p><strong>Horário:</strong> {turma.horarioInicio} - {turma.horarioFim}</p>
                                    </div>
                                    <div className="turma-actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => abrirModalEdicao(turma)}
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {modalAberto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>{excluindo ? 'Excluir Turma' : 'Editar Turma'}</h2>
                            <button className="close-btn" onClick={fecharModal}>×</button>
                        </div>
                        
                        <div className="modal-content">
                            {excluindo ? (
                                <div className="delete-confirmation">
                                    <p>Tem certeza que deseja excluir a turma <strong>{turmaEditando.turma}</strong>?</p>
                                    <p>Esta ação não pode ser desfeita.</p>
                                    
                                    <div className="modal-actions">
                                        <button 
                                            className="cancel-btn"
                                            onClick={cancelarExclusao}
                                            disabled={isLoading}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            className="delete-confirm-btn"
                                            onClick={excluirTurma}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Excluindo...' : 'Excluir'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="edit-turma">Turma *</label>
                                            <input
                                                type="text"
                                                id="edit-turma"
                                                value={turmaEditando.turma}
                                                onChange={(e) => setTurmaEditando({...turmaEditando, turma: e.target.value})}
                                                required
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="edit-professor">Professor *</label>
                                            <input
                                                type="text"
                                                id="edit-professor"
                                                value={turmaEditando.professor}
                                                onChange={(e) => setTurmaEditando({...turmaEditando, professor: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="edit-materia">Matéria *</label>
                                            <input
                                                type="text"
                                                id="edit-materia"
                                                value={turmaEditando.materia}
                                                onChange={(e) => setTurmaEditando({...turmaEditando, materia: e.target.value})}
                                                required
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="edit-data">Data *</label>
                                            <input
                                                type="date"
                                                id="edit-data"
                                                value={turmaEditando.data}
                                                onChange={(e) => setTurmaEditando({...turmaEditando, data: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="edit-sala">Sala *</label>
                                            <input
                                                type="text"
                                                id="edit-sala"
                                                value={turmaEditando.sala}
                                                onChange={(e) => setTurmaEditando({...turmaEditando, sala: e.target.value})}
                                                required
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="edit-periodo">Período *</label>
                                            <select
                                                id="edit-periodo"
                                                value={turmaEditando.periodo}
                                                onChange={(e) => setTurmaEditando({...turmaEditando, periodo: e.target.value})}
                                                required
                                            >
                                                <option value="Matutino">Manhã</option>
                                                <option value="Vespertino">Tarde</option>
                                                <option value="Noturno">Noite</option>
                                            </select>   
                                        </div>
                                    </div>
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="edit-horarioInicio">Horário de Início *</label>
                                            <input
                                                type="time"
                                                id="edit-horarioInicio"
                                                value={turmaEditando.horarioInicio}
                                                onChange={(e) => setTurmaEditando({...turmaEditando, horarioInicio: e.target.value})}
                                                required
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="edit-horarioFim">Horário de Término *</label>
                                            <input
                                                type="time"
                                                id="edit-horarioFim"
                                                value={turmaEditando.horarioFim}
                                                onChange={(e) => setTurmaEditando({...turmaEditando, horarioFim: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="modal-actions">
                                        <button 
                                            className="delete-btn"
                                            onClick={confirmarExclusao}
                                            disabled={isLoading}
                                        >
                                            Excluir
                                        </button>
                                        <button 
                                            className="save-btn"
                                            onClick={salvarEdicao}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}