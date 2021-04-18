module.exports = function(input) {
    input = input - 10800000;
    const days = {
        Mon: 'Segunda',
        Tue: 'Terça',
        Wed: 'Quarta',
        Thu: 'Quinta',
        Fri: 'Sexta',
        Sat: 'Sábado',
        Sun: 'Domingo',
    }
    const months = {
        Jan: 'janeiro',
        Feb: 'fevereiro',
        Mar: 'março',
        Apr: 'abril',
        May: 'maio',
        June: 'junho',
        Jul: 'julho',
        Aug: 'agosto',
        Sept: 'setembro',
        Oct: 'outubro',
        Nov: 'novembro',
        Dec: 'dezembro',
    }
    const date = new Date(input).toString().slice(0,21).split(' ');
    [date[1], date[2]] = [date[2], `de ${months[date[1]]}`];

    if (date[1] < 10) date[1] = date[1].slice(1);
    date[0] = `${days[date[0]]},`;
    date[3] = `de ${date[3]}`;
    date[4] = `às ${date[4]}`;
    return date.join(' ');
}