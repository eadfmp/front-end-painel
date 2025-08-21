import axios from 'axios';
import { useEffect, useState } from 'react';
import './Admin.css';

export default function Admin() {
    const [turmas, setTurmas] = useState([]);
    const [turma, setTurma] = useState('');
    const [professor, setProfessor] = useState('');
    const [materia, setMateria] = useState('');
    const [diaSemana, setDiaSemana] = useState('');
    const [sala, setSala] = useState('');
    const [periodo, setPeriodo] = useState('');
    const [horarioInicio, setHorarioInicio] = useState('');
    const [horarioFim, setHorarioFim] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const obterDiaSemana = () => {
        const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const hoje = new Date();
        return dias[hoje.getDay()];
    };

    const determinarPeriodo = () => {
        const agora = new Date();
        const horas = agora.getHours();

        if (horas < 12) {
            return 'Matutino';
        } else if (horas < 19) {
            return 'Vespertino';
        } else {
            return 'Noturno';
        }
    };

    useEffect(() => {
        fetchTurmas();
    }, []);

    async function fetchTurmas() {
        try {
            setIsLoading(true);
            const periodoAtual = determinarPeriodo();
            const diaAtual = obterDiaSemana();

            let endpoint = '';

            switch (periodoAtual) {
                case 'Matutino':
                    endpoint = `/listar-manha/${diaAtual}`;
                    break;
                case 'Vespertino':
                    endpoint = `/listar-tarde/${diaAtual}`;
                    break;
                case 'Noturno':
                    endpoint = `/listar-noite/${diaAtual}`;
                    break;
                default:
                    endpoint = `/listar-manha/${diaAtual}`;
            }

            const response = await axios.get(`http://localhost:3000${endpoint}`);
            setTurmas(response.data);
        } catch (error) {
            console.error('Erro ao buscar aulas:', error);
            setTurmas(dadosExemplo);
        } finally {
            setIsLoading(false);
        }
    }

    async function addTurma(e) {
        e.preventDefault();
        setIsLoading(true);
        setMensagem('');
        
        if (!turma || !professor || !materia || !diaSemana || !sala || !periodo || !horarioInicio || !horarioFim) {
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
                diaSemana,
                sala,
                periodo,
                horarioInicio,
                horarioFim
            };

            const response = await axios.post('http://localhost:3000/add', novaTurma);
            
            if (response.status === 201 || response.status === 200) {
                setMensagem('Turma adicionada com sucesso!');
                setTurma('');
                setProfessor('');
                setMateria('');
                setDiaSemana('');
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
                                <label htmlFor="diaSemana">Dia da Semana *</label>
                                <select
                                    id="diaSemana"
                                    value={diaSemana}
                                    onChange={(e) => setDiaSemana(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione um dia</option>
                                    <option value="Segunda">Segunda-feira</option>
                                    <option value="Terça">Terça-feira</option>
                                    <option value="Quarta">Quarta-feira</option>
                                    <option value="Quinta">Quinta-feira</option>
                                    <option value="Sexta">Sexta-feira</option>
                                    <option value="Sábado">Sábado</option>
                                </select>
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
                    <h2>Turmas Cadastradas</h2>
                    {isLoading ? (
                        <p className="empty-list">Carregando turmas...</p>
                    ) : turmas.length === 0 ? (
                        <p className="empty-list">Nenhuma turma cadastrada ainda.</p>
                    ) : (
                        <div className="turmas-grid">
                            {turmas.map(turma => (
                                <div key={turma.id} className="turma-card">
                                    <div className="turma-header">
                                        <h3>{turma.turma} - {turma.materia}</h3>
                                        <span className={`periodo-badge ${turma.periodo.toLowerCase()}`}>
                                            {turma.periodo}
                                        </span>
                                    </div>
                                    <div className="turma-details">
                                        <p><strong>Professor:</strong> {turma.professor}</p>
                                        <p><strong>Dia:</strong> {turma.diaSemana}</p>
                                        <p><strong>Sala:</strong> {turma.sala}</p>
                                        <p><strong>Horário:</strong> {turma.horarioInicio} - {turma.horarioFim}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}