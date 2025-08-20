import axios from 'axios';
import { useEffect, useState } from 'react';
import Image1 from  '../assets/logo.png'
import './Painel.css';

export default function Painel() {
    const [aulas, setAulas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [periodoAtual, setPeriodoAtual] = useState('');
    const [diaAtual, setDiaAtual] = useState('');
    const [colunas, setColunas] = useState(4); // Número padrão de colunas

    // Função para obter o dia da semana em português
    const obterDiaSemana = () => {
        const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const hoje = new Date();
        return dias[hoje.getDay()];
    };

    // Função para determinar o período do dia
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

    // Ajustar o número de colunas com base no número de aulas
    const ajustarLayout = (quantidadeAulas) => {
        if (quantidadeAulas <= 4) {
            setColunas(quantidadeAulas || 1); // Mínimo de 1 coluna
        } else if (quantidadeAulas <= 9) {
            setColunas(3);
        } else if (quantidadeAulas <= 16) {
            setColunas(4);
        } else {
            setColunas(5);
        }
    };

    const buscarAulas = async () => {
        try {
            setLoading(true);
            const periodo = determinarPeriodo();
            setPeriodoAtual(periodo);

            const dia = obterDiaSemana();
            setDiaAtual(dia);

            let endpoint = '';

            switch (periodo) {
                case 'Matutino':
                    endpoint = `/listar-manha/${dia}`;
                    break;
                case 'Vespertino':
                    endpoint = `/listar-tarde/${dia}`;
                    break;
                case 'Noturno':
                    endpoint = `/listar-noite/${dia}`;
                    break;
                default:
                    endpoint = `/listar-manha/${dia}`;
            }

            const response = await axios.get(`http://localhost:3000${endpoint}`);
            setAulas(response.data);
            ajustarLayout(response.data.length);
        } catch (error) {
            console.error('Erro ao buscar aulas:', error);
            // Dados de exemplo para demonstração
            const dadosExemplo = [
                {
                    id: 1,
                    turma: "A101",
                    professor: "Carlos Silva",
                    materia: "Matemática",
                    sala: "Sala 12",
                    horarioInicio: "08:00",
                    horarioFim: "10:00"
                },
                {
                    id: 2,
                    turma: "B205",
                    professor: "Maria Santos",
                    materia: "História",
                    sala: "Sala 05",
                    horarioInicio: "10:00",
                    horarioFim: "12:00"
                }
            ];
            setAulas(dadosExemplo);
            ajustarLayout(dadosExemplo.length);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarAulas();

        // Atualizar a cada hora para mudar o período se necessário
        const interval = setInterval(() => {
            buscarAulas();
        }, 3600000); // 1 hora

        return () => clearInterval(interval);
    }, []);

    // Formatar horário para exibição
    const formatarHorario = (horario) => {
        if (!horario) return '';

        // Se já estiver no formato HH:MM, retorna como está
        if (horario.includes(':')) {
            return horario;
        }

        // Se for um objeto Date, formata
        if (horario instanceof Date) {
            return horario.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }

        return horario;
    };

    return (
        <div className="painel-container">
            <header className="painel-header">
                <div className="header-content">
                    <a href="/admin">
                    <img src={Image1} alt="Logo da Faculdade" className="logo-faculdade" />
                    </a>
                    <div className="header-info">
                        <h1>Sistema de Gestão de Aulas</h1>
                        <div className="info-periodo">
                            <span className="periodo">{periodoAtual}</span>
                            <span className="dia">{diaAtual}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="painel-content">
                <div className="controles">
                    <button onClick={buscarAulas} className="btn-atualizar">
                        Atualizar
                    </button>
                    <div className="legenda-periodos">
                        <div className="legenda-item">
                            <span className="indicador manha"></span>
                            <span>Matutino (antes das 12h)</span>
                        </div>
                        <div className="legenda-item">
                            <span className="indicador tarde"></span>
                            <span>Vespertino (12h - 19h)</span>
                        </div>
                        <div className="legenda-item">
                            <span className="indicador noite"></span>
                            <span>Noturno (após 19h)</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Carregando aulas...</p>
                    </div>
                ) : (
                    <>
                        <h2>Aulas do Período {periodoAtual}</h2>

                        {aulas.length === 0 ? (
                            <div className="sem-aulas">
                                <div className="icone-sem-aulas">📚</div>
                                <h3>Nenhuma aula neste período</h3>
                                <p>Não há aulas agendadas para o período {periodoAtual.toLowerCase()} de {diaAtual}.</p>
                            </div>
                        ) : (
                            <div className="aulas-grid" style={{ '--colunas': colunas }}>
                                {aulas.map(aula => (
                                    <div key={aula.id} className="aula-card">
                                        <div className="aula-header">
                                            <h3>{aula.materia}</h3>
                                            <span className="turma-badge">{aula.turma}</span>
                                        </div>
                                        <div className="aula-details">
                                            <p><strong>Professor:</strong> {aula.professor}</p>
                                            <p><strong>Sala:</strong> {aula.sala}</p>
                                            <p><strong>Horário:</strong> {formatarHorario(aula.horarioInicio)} - {formatarHorario(aula.horarioFim)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <footer className="painel-footer">
                <p>Atualizado automaticamente conforme o horário do sistema</p>
            </footer>
        </div>
    );
}