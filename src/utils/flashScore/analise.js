const { pgJogadores } = require("./tools/pgJogadores");

function analiseFunction(jogos) {
  let analise = [];
  for (const jogo of jogos) {
    const casa = () => {
      const estatisticas = jogo.timeCasa.estatisticas;
      const gols = jogo.timeCasa.gols;

      const golsFeitosTotais = gols.total.golsFeitos;
      const golsFeitosLocal = gols.casa.golsFeitos;

      const golsSofridosTotais = gols.total.golsSofridos;
      const golsSofridosLocal = gols.casa.golsSofridos;

      const totalFora = estatisticas.total["Chutes no Gol"] ?? 0;
      const totalBlock = estatisticas.total["Chutes Bloqueados"] ?? 0;

      const homeFora = estatisticas.casa["Chutes no Gol"] ?? 0;
      const homeBlock = estatisticas.casa["Chutes Bloqueados"] ?? 0;

      const chutesTotais = totalFora + totalBlock;
      const defesasTotais = estatisticas.total["Defesas do Goleiro"] ?? 0;

      const chutesLocal = homeFora + homeBlock;
      const defesasLocal = estatisticas.casa["Defesas do Goleiro"] ?? 0;

      const participacoes = pgJogadores(jogo.timeCasa.events.total);

      return {
        time: jogo.timeCasa.time,
        chutesLocal,
        chutesTotais,
        defesasTotais,
        defesasLocal,
        golsSofridosLocal,
        golsSofridosTotais,
        golsFeitosTotais,
        golsFeitosLocal,
        participacoes,
        jogosSemSofrerGol: jogo.timeCasa.jogosSemSofrer,
      };
    };

    const fora = () => {
      const estatisticas = jogo.timeFora.estatisticas;
      const gols = jogo.timeFora.gols;

      const golsFeitosTotais = gols.total.golsFeitos;
      const golsFeitosLocal = gols.fora.golsFeitos;

      const golsSofridosTotais = gols.total.golsSofridos;
      const golsSofridosLocal = gols.fora.golsSofridos;

      const totalFora = estatisticas.total["Chutes no Gol"] ?? 0;
      const totalBlock = estatisticas.total["Chutes Bloqueados"] ?? 0;

      const awayFora = estatisticas.fora["Chutes no Gol"] ?? 0;
      const awayBlock = estatisticas.fora["Chutes Bloqueados"] ?? 0;

      const chutesTotais = totalFora + totalBlock;
      const defesasTotais = estatisticas.total["Defesas do Goleiro"] ?? 0;

      const chutesLocal = awayFora + awayBlock;
      const defesasLocal = estatisticas.fora["Defesas do Goleiro"] ?? 0;

      const participacoes = pgJogadores(jogo.timeFora.events.total);

      return {
        time: jogo.timeFora.time,
        chutesLocal,
        chutesTotais,
        defesasTotais,
        defesasLocal,
        golsSofridosLocal,
        golsSofridosTotais,
        golsFeitosTotais,
        golsFeitosLocal,
        participacoes,
        jogosSemSofrerGol: jogo.timeFora.jogosSemSofrer,
      };
    };

    const chanceGolFora =
      ((fora().golsFeitosLocal + fora().golsFeitosTotais) / 2 +
        (casa().golsSofridosLocal + casa().golsSofridosTotais) / 2) /
      2;

    const chanceGolCasa =
      ((casa().golsFeitosLocal + casa().golsFeitosTotais) / 2 +
        (fora().golsSofridosLocal + fora().golsSofridosTotais) / 2) /
      2;

    const chanceGolForaLocal =
      (fora().golsFeitosLocal + casa().golsSofridosLocal) / 2;

    const chanceGolCasaLocal =
      (casa().golsFeitosLocal + fora().golsSofridosLocal) / 2;

    const diferenca = chanceGolFora - chanceGolCasa;

    const diferencaChance = diferenca < 0 ? -diferenca : diferenca;

    const diferencaLocal = chanceGolForaLocal - chanceGolCasaLocal;

    const diferencaLocalChance = diferencaLocal < 0 ? -diferencaLocal : diferencaLocal;

    const chanceDefesasCasa = (casa().defesasLocal + casa().defesasTotais) / 2;

    const chanceDefesasFora = (fora().defesasLocal + fora().defesasTotais) / 2;

    analise.push({
      casa: casa(),
      fora: fora(),
      chanceGolFora,
      chanceGolCasa,
      chanceGolForaLocal,
      chanceGolCasaLocal,
      chanceDefesasCasa,
      chanceDefesasFora,
      diferencaLocalChance,
      arbitro: jogo.arbitro,
      diferencaChance,
    });
  }

  let maxDiferenca = 0;

  for (const anal of analise) {
    maxDiferenca += anal.diferencaChance;
  }
  let mediaDiferenca = maxDiferenca / analise.length;

  analiseIndicator = [];

  for (const anal of analise) {
    if (anal.diferencaChance > mediaDiferenca) {
      analiseIndicator.push({ ...anal, indicative: true });
    } else {
      analiseIndicator.push({ ...anal, indicative: false });
    }
  }

  let analiseComMedia = { analiseIndicator, mediaDiferenca };

  return analiseComMedia;
}

module.exports = { analiseFunction };
