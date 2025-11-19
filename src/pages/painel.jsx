import axios from 'axios';
import { useEffect, useState } from 'react';
import Image1 from '../assets/logo.png';
import './Painel.css';

export default function Painel() {
    const [aulas, setAulas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [periodoAtual, setPeriodoAtual] = useState('');
    const [dataAtual, setDataAtual] = useState('');

    const obterDataAtual = () => {
    const hoje = new Date();

    const dataBR = hoje.toLocaleDateString('pt-BR');

    const [dia, mes, ano] = dataBR.split('/');

    return `${ano}-${mes}-${dia}`;
};


    const formatarDataExibicao = (dataString) => {
        if (!dataString) return '';

        const partes = dataString.split('-');
        const dataFormatada = partes.reverse().join('/');

        return dataFormatada;
    };

    const determinarPeriodo = () => {
        const agora = new Date();
        const horas = agora.getHours();

        if (horas < 12) return 'Matutino';
        if (horas < 19) return 'Vespertino';
        return 'Noturno';
    };

    const buscarAulas = async () => {
        try {
            setLoading(true);

            const periodo = determinarPeriodo();
            setPeriodoAtual(periodo);

            const data = obterDataAtual();
            setDataAtual(data);

            let endpoint = '';

            switch (periodo) {
                case 'Matutino':
                    endpoint = `/listar-manha/${data}`;
                    break;
                case 'Vespertino':
                    endpoint = `/listar-tarde/${data}`;
                    break;
                case 'Noturno':
                    endpoint = `/listar-noite/${data}`;
                    break;
                default:
                    endpoint = `/listar-manha/${data}`;
            }

            console.log('🔍 Fazendo requisição para:', endpoint);

            const response = await axios.get(`https://back-end-painel.onrender.com${endpoint}`);
            setAulas(response.data);

        } catch (error) {
            console.error('❌ Erro ao buscar aulas:', error);
            setAulas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarAulas();

        const interval = setInterval(() => {
            buscarAulas();
        }, 3600000);

        return () => clearInterval(interval);
    }, []);

    const formatarHorario = (horario) => {
        if (!horario) return '';
        if (horario.includes(':')) return horario.slice(0,5);

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
                        <h1>Sistema de Gestão de Salas</h1>
                        <p className="data-atual">
                        </p>
                    </div>
                </div>
            </header>

            <div className="painel-content">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Carregando aulas...</p>
                    </div>
                ) : (
                    <>
                        <h2>Aulas do Período {periodoAtual}</h2>
                        <p className="data-exibicao">
                        </p>

                        {aulas.length === 0 ? (
                            <div className="sem-aulas">
                                <div className="icone-sem-aulas">📚</div>
                                <h3>Nenhuma aula neste período</h3>
                                <p>
                                    Não há aulas agendadas para o período {periodoAtual.toLowerCase()}
                                    de {dataAtual && formatarDataExibicao(dataAtual)}.
                                </p>
                            </div>
                        ) : (
                            <div className="aulas-grid-container">
                                <div className="aulas-grid">
                                    {aulas.map(aula => (
                                        <div key={aula.id} className="aula-card">
                                            <div className="aula-header">
                                                <h3>{aula.materia}</h3>
                                                <span className="turma-badge">{aula.turma}</span>
                                            </div>
                                            <div className="aula-details">
                                                <p><strong>Professor:</strong> {aula.professor}</p>
                                                <p><strong>Sala:</strong> {aula.sala}</p>
                                                <p>
                                                    <strong>Horário: </strong>
                                                    {formatarHorario(aula.horarioInicio)} - {formatarHorario(aula.horarioFim)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
