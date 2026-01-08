let alunos = [];

function adicionarAluno() {
    const nome = document.getElementById("nomeAluno").value;

    if (!nome) {
        alert("Informe o nome do aluno.");
        return;
    }

    alunos.push({
        nome,
        faltas: 0,
        justificativa: ""
    });

    document.getElementById("nomeAluno").value = "";
    atualizarTabela();
}

function atualizarTabela() {
    const tbody = document.getElementById("listaAlunos");
    tbody.innerHTML = "";

    alunos.forEach((aluno, i) => {
        tbody.innerHTML += `
        <tr>
            <td>${aluno.nome}</td>
            <td>
                <input type="number" min="0" value="${aluno.faltas}"
                onchange="alunos[${i}].faltas = this.value">
            </td>
            <td>
                <input type="text" value="${aluno.justificativa}"
                onchange="alunos[${i}].justificativa = this.value">
            </td>
            <td>
                <button onclick="removerAluno(${i})">❌</button>
            </td>
        </tr>`;
    });
}

function removerAluno(i) {
    alunos.splice(i, 1);
    atualizarTabela();
}

/* ==========================
   RELATÓRIO + E-MAIL
========================== */

function gerarRelatorio(tipo) {
    if (alunos.length === 0) {
        alert("Nenhum aluno cadastrado.");
        return;
    }

    const turma = document.getElementById("turma").value;
    const professor = document.getElementById("professor").value;
    const email = document.getElementById("email").value;

    let csv = "Tipo Relatório,Turma,Professor,Aluno,Faltas,Justificativa\n";

    alunos.forEach(a => {
        csv += `${tipo},${turma},${professor},${a.nome},${a.faltas},${a.justificativa}\n`;
    });

    // GERA EXCEL
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const data = new Date().toLocaleDateString("pt-BR").replaceAll("/", "-");
    const nomeArquivo = `Relatorio_Evasao_${tipo}_${data}.csv`;

    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo;
    a.click();

    // ABRE CLIENTE DE EMAIL
    if (email) {
        const assunto = `Relatório ${tipo} - Controle de Evasão`;
        const corpo = `
Prezados,

Segue o relatório ${tipo} de controle de evasão da turma ${turma}.

Professor: ${professor}

Arquivo em anexo.

Atenciosamente.
        `;

        window.location.href =
            `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    }
}
