# Resumo Crítico dos Artigos em Português — Monitoramento e Incêndios Florestais

> [!NOTE]
> **Contexto para o TCC:** Este documento consolida a análise detalhada dos 10 trabalhos em língua portuguesa (dissertações, artigos em periódicos, monografias de TCC e anais de eventos). O objetivo é identificar quais metodologias, variáveis e algoritmos apresentam melhor relação entre **facilidade de execução** e **robustez científica** para subsidiar a escolha metodológica do TCC.

---

## 📊 Síntese Comparativa dos Trabalhos Nacionais

| Artigo / Trabalho | Bioma | Abordagem Principal | Sensores / Dados | Algoritmo / Ferramenta | Métrica de Desempenho | Dificuldade TCC |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Mauro Lemes Filho (IF Goiano, 2023)** | Cerrado | Mudanças LULC / Séries Temporais | Landsat / MapBiomas | Mann-Kendall / Sen / GEE | $p < 0,05$, $Z$-score | Baixa |
| **Pirajá et al. (RA'EGA, 2023)** | Pantanal | Delimitação de Queimadas / NBR | Sentinel-2 (MSI) | NBR, $\Delta$NBR, USGS / QGIS | Limiares Espectrais | Muito Baixa |
| **Geovane Barbosa (UFRRJ, 2022)** | Pantanal | Focos de Calor e Cicatrizes | BDQueimadas / Sentinel-2 | NBR, SCP Plugin / QGIS | Correlação $r = -0,78$ | Muito Baixa |
| **Gabriel S. Carvalho (UFES, 2024)** | Mata Atlântica | Suscetibilidade e Zoneamento | SRTM, MapBiomas, INPE | Lógica Fuzzy + AHP / ArcGIS | Validação Espacial | Baixa |
| **José Mário Miranda (IFPB, 2024)** | Amazônia / TI | Plataforma Integrada de Alertas | BDQueimadas, DETER, MapBiomas | Design Science (DSR), PostGIS | Redução tempo de resposta | Média |
| **Silva & Santos (SBIAGRO, 2023)** | Amazônia | Detecção sob Nuvens / SAR | Radar ICEYE Banda X | CNN (U-Net + ResNet) | F1: 88,1%, Prec: 89,4% | Alta |
| **CBMERJ (Soldado do Fogo, 2025)** | Geral | Revisão Sistemática | Scopus, WoS, SciELO | Protocolo PRISMA | Análise de 64 artigos | Baixa |
| **GeoSaber / UN-SPIDER (2019)** | Geral | Tutorial de Severidade | Sentinel-2 | Álgebra de mapas / QGIS e R | Escala de Severidade USGS | Muito Baixa |
| **Natália Gomes (UFU, 2025)** | Geral | Segmentação Semântica Profunda | Sentinel-2 (20m) | U-Net + EfficientNet-B3 (Focal/Dice) | F1: 91,4%, IoU: 84,2% | Alta |
| **Anais XX SBSR (SBSR, 2023)** | Geral / Brasil | Panorama Estado da Arte | CBERS, Sentinel, Landsat | GEE, Random Forest, MapBiomas | Revisão Coletiva | Baixa |

---

## 1. Sensoriamento Remoto Orbital e Análise de Tendência nas Mudanças da Cobertura e Uso do Solo no Cerrado Goiano
- **Arquivo:** `portugues/cerrado/monitoramento-e-uso-do-solo/IFGoiano_Dissertacao_Mauro_Lemes_Filho.pdf`
- **Autor / Instituição:** Mauro Lemes Filho (Dissertação de Mestrado, Instituto Federal Goiano — Campus Ceres, 2023)

### Resumo
O estudo avaliou a dinâmica têmporo-espacial da cobertura e uso da terra na Microrregião de Ceres, no Cerrado goiano, entre 1985 e 2021. Utilizando séries temporais do MapBiomas e testes estatísticos de tendência, a pesquisa quantificou a perda contínua de vegetação nativa do Cerrado e o expressivo avanço das atividades agropecuárias e da agricultura irrigada, fornecendo subsídios para entender a fragmentação ambiental e o consequente aumento da combustibilidade da paisagem.

### Materiais e métodos
- **Dados utilizados:** Séries anuais da Coleção 7 do MapBiomas (resolução espacial de 30 metros, baseada no Landsat), dados do Censo Agropecuário do IBGE e malhas vetoriais de limites hidrográficos e municipais.
- **Processamento:** Executado via **Google Earth Engine (GEE)** e processamento complementar em ambiente **QGIS**.
- **Análise Estatística:** Aplicação do teste não paramétrico de **Mann-Kendall** para identificar tendências significativas de aumento ou declínio das classes de cobertura, associado ao estimador de declividade de **Sen's Slope** para mensurar a magnitude anual dessa variação.

> [!TIP]
> **Trecho de Destaque do Artigo:**
> *"A utilização dos dados do MapBiomas combinada com a computação em nuvem do Google Earth Engine permitiu reconstruir quase quatro décadas de transições na cobertura do solo sem a necessidade de baixar e armazenar localmente centenas de cenas Landsat, viabilizando análises de séries temporais longas com alta reproducibilidade."*
> 
> *Explicação:* Esse ponto é crucial para um TCC. Em vez de gastar semanas baixando imagens brutas de satélite e sobrecarregando o computador, o uso de coleções prontas no GEE (como MapBiomas) permite focar diretamente na análise ambiental e na modelagem estatística.

### Resultados
- Redução de mais de 18% da cobertura vegetal nativa remanescente do Cerrado na região entre 1985 e 2021.
- Aumento da área agrícola irrigada em mais de 140%, acelerando a pressão sobre recursos hídricos.
- Identificou-se forte tendência estatística ($p < 0,01$) de conversão de savanas e matas de galeria em pastagens cultivadas, criando mosaicos fragmentados altamente suscetíveis à propagação de fogo acidental na estiagem.

---

## 2. O uso dos índices espectrais NBR e ΔNBR empregando dados Sentinel-2 para identificar e delimitar áreas queimadas (Pantanal de Nhecolândia, MS)
- **Arquivo:** `portugues/pantanal/indices-espectrais-e-cicatrizes/O_Uso_Do_Indice_Espectral_Delta_nbr_Uti.pdf`
- **Autores / Revista:** Rennan Vilhena Pirajá, Ademir K. M. de Oliveira, Rosemary Matias, Ary T. Rezende Filho (Revista *RA'EGA — O Espaço Geográfico em Análise*, v. 56, 2023)

### Resumo
O artigo avalia a eficácia dos índices espectrais NBR (*Normalized Burn Ratio*) e $\Delta$NBR no mapeamento de cicatrizes de queimadas na sub-região da Nhecolândia, Pantanal sul-mato-grossense. Utilizando imagens Sentinel-2 MSI de antes e depois de um grande incêndio florestal em 2020, os autores demonstraram que o índice permite delimitar áreas queimadas com grande precisão, diferenciando-as de superfícies de água e vegetação estressada pela seca.

### Materiais e métodos
- **Sensor e Imagens:** Imagens de satélite Sentinel-2/MSI (nível de processamento 2A - reflectância de superfície), utilizando a **Banda 8A** (NIR estreito, 865 nm, 20m) e a **Banda 12** (SWIR-2, 2190 nm, 20m).
- **Equações empregadas:**
  $$\text{NBR} = \frac{\text{NIR} - \text{SWIR}}{\text{NIR} + \text{SWIR}} = \frac{\text{B8A} - \text{B12}}{\text{B8A} + \text{B12}}$$
  $$\Delta\text{NBR} = \text{NBR}_{\text{pré-fogo}} - \text{NBR}_{\text{pós-fogo}}$$
- **Classificação:** Reclassificação temática do $\Delta$NBR conforme os limiares padronizados do *United States Geological Survey* (USGS), separando áreas não queimadas, de baixa, moderada e alta severidade.
- **Software:** **QGIS** com o complemento *Semi-Automatic Classification Plugin* (SCP).

> [!TIP]
> **Trecho de Destaque do Artigo:**
> *"O emprego da Banda 8A em substituição à Banda 8 convencional do Sentinel-2 reduz a contaminação por vapor d'água atmosférico. No infravermelho de ondas curtas (Banda 12), a queima da vegetação e a exposição do carvão provocam aumento drástico da reflectância, enquanto o NIR sofre forte absorção pela quebra da estrutura celular foliar, gerando um contraste ideal no $\Delta\text{NBR}$."*
> 
> *Explicação:* Em biomas com corpos hídricos ou alta umidade como o Pantanal, utilizar a banda 8A (vegetation red edge / NIR estreito) em vez da banda 8 larga evita confundir lagoas/vazantes secas com cicatrizes de queima.

### Resultados
- Mapeamento e delimitação exata de **8.923,5 hectares** de área consumida pelo fogo no evento analisado.
- Demonstrou que o $\Delta$NBR supera amplamente o NDVI na separação entre queima real e dessecação sazonal da vegetação pantaneira.
- Prova de conceito excelente para TCC: o cálculo é leve, pode ser feito inteiramente no QGIS em poucos minutos e dispensa hardware potente.

---

## 3. Focos de Calor e Cicatrizes de Incêndios no Parque Estadual do Encontro das Águas (PEEA), Mato Grosso
- **Arquivo:** `portugues/pantanal/indices-espectrais-e-cicatrizes/UFRRJ_Dissertacao_Geovane_Barbosa.pdf`
- **Autor / Instituição:** Geovane Barbosa (Monografia de Conclusão de Curso em Eng. Florestal, UFRRJ, 2022)

### Resumo
O trabalho investigou o comportamento dos focos de calor ao longo de uma série histórica de 9 anos (2012–2020) e calculou a extensão espacial das cicatrizes de incêndio entre 2018 e 2020 no Parque Estadual do Encontro das Águas (PEEA), localizado no Pantanal mato-grossense. O estudo comprovou a catástrofe ocorrida no ano de 2020, quando o fogo consumiu a maior parte da unidade de conservação, e correlacionou a frequência de ignições com o déficit de precipitação regional.

### Materiais e métodos
- **Dados de Focos de Calor:** Base de dados do **BDQueimadas/INPE**, utilizando o satélite de referência (*AQUA_M-T*) e sensores MODIS/VIIRS.
- **Filtro de Redundância:** Exclusão sistemática de focos múltiplos registrados para um mesmo evento na mesma data por sensores concorrentes.
- **Mapeamento de Cicatrizes:** Imagens de satélite Sentinel-2 pré e pós-estação seca (2018 a 2020); cálculo do NBR no **QGIS 3.16** com apoio do plugin SCP.
- **Climatologia:** Séries mensais de precipitação e temperatura do banco de dados do INMET e dados de grade CHIRPS.

> [!TIP]
> **Trecho de Destaque do Artigo:**
> *"A utilização isolada do número bruto de focos de calor sem o filtro do satélite de referência gera superestimativa severa das queimadas. Apenas com a filtragem por satélite de referência e cruzamento com o índice NBR é possível validar a real área física danificada."*
> 
> *Explicação:* Dica essencial para TCCs que usam dados do INPE: ao baixar dados de focos no BDQueimadas, sempre filtre pelo satélite de referência (ou satélite sensor padrão), caso contrário o mesmo incêndio será contado 5 vezes no mesmo dia por satélites diferentes.

### Resultados
- O ano de 2020 foi identificado como anômalo e devastador: consumiu **85,2% da área total do Parque (mais de 92.000 hectares)**.
- Forte correlação negativa ($r = -0,78$) entre os índices mensais de precipitação e a concentração de focos de calor.
- Os meses de agosto, setembro e outubro concentraram mais de 91% de todas as ocorrências de fogo em toda a série histórica de quase uma década.

---

## 4. Estratégias de Prevenção aos Incêndios Florestais com Base em Análises Geoespaciais
- **Arquivo:** `portugues/mata-atlantica/suscetibilidade-e-risco/UFES_TCC_Gabriel_Severo_Carvalho.pdf`
- **Autor / Instituição:** Gabriel Severo Carvalho (Trabalho de Conclusão de Curso em Eng. Florestal, UFES, 2024)

### Resumo
Este TCC desenvolveu um modelo de zoneamento de risco de ocorrência de incêndios florestais para a Reserva Biológica de Sooretama (ES) e sua zona de amortecimento na Mata Atlântica. Utilizando a Lógica Fuzzy associada ao Processo Analítico Hierárquico (AHP) em ambiente SIG, o trabalho combinou variáveis topográficas, meteorológicas, antrópicas e de uso da terra para gerar um mapa contínuo de vulnerabilidade ao fogo, servindo como modelo direto de TCC voltado à gestão de áreas protegidas.

### Materiais e métodos
- **Área de Estudo:** Rebio de Sooretama e entorno (Mata Atlântica de Tabuleiro, ES).
- **Variáveis Condicionantes Integradas:**
  1. *Topográficas:* Altitude, declividade e aspecto solar derivadas do MDE SRTM (30m).
  2. *Antrópicas:* Proximidade de rodovias e estradas (com destaque para a rodovia federal BR-101 que corta a reserva).
  3. *Uso e Cobertura:* Dados do MapBiomas e densidade de biomassa via Análise de Mistura Espectral (SMA).
  4. *Histórico de Ignição:* Densidade de Kernel de focos de calor históricos do INPE.
- **Modelagem Matemática:** Padronização das variáveis contínuas em notas de 0 a 1 via funções de pertinência Fuzzy (Linear e Sigmoidal decrescente/crescente) e ponderação multicritério por pesos definidos via **AHP (Analytic Hierarchy Process)**.

> [!TIP]
> **Trecho de Destaque do Artigo:**
> *"A lógica fuzzy supera as limitações da álgebra de mapas booleana convencional (que categoriza binariamente como 'risco' ou 'não risco'), pois permite expressar o grau contínuo de pertencimento de cada pixel ao risco, refletindo com maior realismo a transição ecológica entre a floresta conservada e as bordas antropizadas."*
> 
> *Explicação:* Para um TCC na graduação, a modelagem Fuzzy/AHP é excelente: é simples de implementar no QGIS/ArcGIS (via calculadora raster), não requer programação avançada nem treinamento computacional de Deep Learning, e produz mapas de risco muito elogiados por bancas examinadoras.

### Resultados
- O mapa final classificou 34,7% da zona de amortecimento em risco "Alto" e "Muito Alto".
- Constatou-se que a proximidade da rodovia BR-101 e a presença de pastagens com capim seco nas bordas foram os fatores de maior peso ponderado no perigo de ignição.
- O interior da reserva preservada apresentou risco baixo, demonstrando que o fogo nessa região tem origem quase 100% antrópica externa.

---

## 5. IndiMap: Monitoramento de Desmatamento e Queimadas em Terras Indígenas
- **Arquivo:** `portugues/amazonia/monitoramento-e-deteccao-sar/IFPB_Dissertacao_Jose_Mario_Fraga_Miranda.pdf`
- **Autor / Instituição:** José Mário Fraga Miranda (Dissertação de Mestrado Profissional em TI, IFPB, 2024)

### Resumo
A dissertação aborda a integração e centralização de alertas de desmatamento e focos de calor na Amazônia Legal, especificamente voltados à proteção de Terras Indígenas. Aplicando a metodologia *Design Science Research* (DSR), o autor projetou e construiu a plataforma **IndiMap**, um sistema computacional que consolida dados abertos do INPE, MapBiomas e DETER em uma interface simplificada para tomada de decisão comunitária e resposta de brigadas indígenas.

### Materiais e métodos
- **Metodologia de Pesquisa:** *Design Science Research* (DSR), focada no desenvolvimento e validação prática de um artefato tecnológico.
- **Fontes de Dados Integradas:** APIs e *web services* públicos do **BDQueimadas (INPE)**, alertas diários do **DETER/PRODES** e relatórios do **MapBiomas Alerta**.
- **Stack Tecnológica:** Banco de dados relacional geográfico **PostGIS/PostgreSQL**, backend em Node.js e visualização cartográfica web interativa com **Leaflet** e GeoJSON.
- **Validação:** Testes de usabilidade e diagnóstico com grupo focal formado por lideranças indígenas e analistas de órgãos ambientais.

> [!TIP]
> **Trecho de Destaque do Artigo:**
> *"A maior barreira para a ação rápida das brigadas comunitárias não é a falta de dados de satélite, mas sim a fragmentação das plataformas oficiais. Cada agência adota um formato, sistema de coordenadas e interface distintos. A centralização em um pipeline automatizado com alertas georreferenciados reduziu o tempo de triagem de incidentes em mais de 60%."*
> 
> *Explicação:* Essa abordagem é perfeita se o seu TCC tiver viés em Ciência da Computação, Sistemas de Informação ou Engenharia: em vez de criar um novo modelo de IA, foca-se em integrar APIs públicas de queimadas e fornecer dashboards operacionais úteis.

### Resultados
- Desenvolvimento completo e entrega da plataforma web funcional IndiMap.
- Redução significativa do tempo de processamento manual dos boletins de monitoramento.
- Validação com alta satisfação entre os usuários finais para identificação prévia de invasões e queimadas em áreas protegidas remotas.

---

## 6. Uma arquitetura de rede neural convolucional para detecção de alvos de desmatamento na Amazônia através de imagens SAR ICEYE
- **Arquivo:** `portugues/amazonia/monitoramento-e-deteccao-sar/SBC_SBIAGRO_Artigo_26563.pdf`
- **Autores / Congresso:** Edson Marques da Silva, Reginaldo Santos (UFPA / Congresso SBIAGRO — SBC OpenLib, 2023)

### Resumo
O trabalho propõe o uso pioneiro de imagens de Radar de Abertura Sintética (SAR) de alta resolução da constelação comercial de microssatélites ICEYE para detectar desmatamentos e clareiras recentes na Amazônia. Diante da severa limitação de nuvens que bloqueia satélites ópticos (Sentinel-2, Landsat) durante grande parte do ano, os autores treinaram uma Rede Neural Convolucional (CNN) para segmentar alvos em imagens de radar na Banda X.

### Materiais e métodos
- **Sensor:** Imagens SAR em **Banda X** da constelação **ICEYE** (resolução espacial de 1 metro no modo Spotlight, polarização VV).
- **Pré-processamento de Radar:** Calibração radiométrica ($\sigma^0$), correção de terreno Doppler e filtragem de ruído *speckle* usando o filtro de *Lee Refinado*.
- **Arquitetura de Inteligência Artificial:** Rede Neural Convolucional baseada em modelo codificador-decodificador (**U-Net**) com *backbone* ResNet pré-treinado.
- **Métricas:** *Precision*, *Recall*, *F1-Score* e acurácia global com validação cruzada 5-fold.

> [!TIP]
> **Trecho de Destaque do Artigo:**
> *"Ao contrário dos sensores ópticos passivos que dependem da luz solar e são bloqueados pela nebulosidade persistente na região equatorial, os sensores SAR ativos operam na faixa de micro-ondas, permitindo a detecção de cortes rasos e queimadas mesmo sob céu completamente nublado ou à noite."*
> 
> *Explicação:* Uma das grandes limitações de TCCs que usam apenas Sentinel-2 ou Landsat no Brasil é a falta de imagens sem nuvens no período crítico (estação chuvosa/início de queimadas). A menção ao SAR demonstra maturidade metodológica para bancas examinadoras.

### Resultados
- A CNN alcançou **F1-Score de 88,1%** e **Precisão de 89,4%** na detecção automática de desmatamento recente.
- Demonstrou a viabilidade técnica de usar imagens SAR de microssatélites para vigilância em tempo quase real na Amazônia.
- Desafio apontado para TCCs: o pré-processamento de imagens SAR é matematicamente complexo e os dados comerciais de alta resolução (ICEYE) são pagos, enquanto o Sentinel-1 (C-band) é a alternativa gratuita viável.

---

## 7. Sistemas inteligentes de monitoramento para incêndios florestais: uma revisão sistemática
- **Arquivo:** `portugues/geral/revisao-sistematica/CBMERJ_Revista_Soldado_do_Fogo_25.pdf`
- **Autores / Periódico:** Pesquisadores associados ao Corpo de Bombeiros Militar do Estado do Rio de Janeiro (Revista *Soldado do Fogo*, CBMERJ, v. 2, 2025)

### Resumo
Trata-se de uma revisão sistemática da literatura cobrindo os avanços mais recentes em tecnologias inteligentes aplicadas ao monitoramento, prevenção e combate a incêndios florestais no Brasil e no mundo. O artigo cataloga e avalia criticamente o uso de sensoriamento remoto por satélite, veículos aéreos não tripulados (VANTs/drones), redes de sensores em terra (IoT) e algoritmos de Machine Learning e Deep Learning.

### Materiais e métodos
- **Metodologia de Revisão:** Protocolo sistemático internacional **PRISMA** (*Preferred Reporting Items for Systematic Reviews and Meta-Analyses*).
- **Bases de Dados Catalogadas:** Scopus, Web of Science, IEEE Xplore, Google Scholar e SciELO, com filtro temporal de 2018 a 2024.
- **Critérios de Inclusão/Exclusão:** Artigos que implementaram e testaram sistemas computacionais ou modelos preditivos reais aplicados a incêndios florestais.
- **Categorização:** Dividida em 4 eixos: 1) Sensores orbitais; 2) Sensores terrestres e câmeras infravermelhas; 3) VANTs; 4) Algoritmos de IA (Machine Learning e Deep Learning).

> [!TIP]
> **Trecho de Destaque do Artigo:**
> *"Entre os algoritmos de aprendizado de máquina para modelagem de risco e suscetibilidade a incêndios, o Random Forest consolidou-se como o modelo hegemônico na literatura, presente em mais de 45% dos trabalhos analisados, superando regressões logísticas clássicas devido à sua capacidade de lidar com relações não lineares complexas e variáveis colineares sem exigir calibrações excessivas."*
> 
> *Explicação:* Esta é a confirmação mais importante para o seu TCC: o **Random Forest** é o algoritmo mais consagrado e seguro para defender perante uma banca de TCC em modelagem de risco de incêndio.

### Resultados
- O Random Forest e o XGBoost lideram os modelos tabulares de suscetibilidade devido ao melhor equilíbrio entre precisão e interpretabilidade (importância das variáveis).
- A arquitetura U-Net lidera com folga os trabalhos de segmentação de imagens de satélite e visão computacional.
- Identificou-se que o maior gargalo atual não é a acurácia dos modelos, mas sim a latência na transmissão das previsões para os bombeiros que atuam no combate em solo.

---

## 8. Mapeamento de Severidade de Queimadas (UN-SPIDER / GeoSaber) — Prática Recomendada QGIS e R
- **Arquivo:** `portugues/geral/severidade-e-indices-espectrais/GeoSaber_Tutorial_Mapeamento_Queimadas_QGIS_R.pdf`
- **Autoria:** Portal GeoSaber / Baseado nas Práticas Recomendadas da ONU (UN-SPIDER — Plataforma da ONU para Informações Espaciais e Gestão de Desastres)

### Resumo
Este documento constitui o guia operacional oficial da ONU/UN-SPIDER para avaliação de severidade de queimadas pós-incêndio. Ele detalha passo a passo os conceitos espectrais e os procedimentos de cálculo do NBR e do $\Delta$NBR, fornecendo o fluxo de trabalho completo tanto em interface gráfica (QGIS) quanto em scripts reprodutíveis em linguagem R.

### Materiais e métodos
- **Satélite de Referência:** Sentinel-2 MSI (Bandas B8A NIR e B12 SWIR2).
- **Critérios de Seleção de Cenas:** Seleção de um par de imagens sem nuvens (uma cena imediatamente anterior ao fogo e outra logo após o controle das chamas).
- **Fluxo no QGIS:**
  1. Cálculo de $\text{NBR}_{\text{pré}} = (\text{B8A} - \text{B12}) / (\text{B8A} + \text{B12})$
  2. Cálculo de $\text{NBR}_{\text{pós}} = (\text{B8A} - \text{B12}) / (\text{B8A} + \text{B12})$
  3. Diferenciação: $\Delta\text{NBR} = \text{NBR}_{\text{pré}} - \text{NBR}_{\text{pós}}$
  4. Reclassificação matricial segundo a tabela da USGS em 5 classes: Não queimado ($< 0,1$), Severidade Baixa ($0,10$ a $0,27$), Moderada-Baixa ($0,27$ a $0,44$), Moderada-Alta ($0,44$ a $0,66$) e Alta ($> 0,66$).
- **Implementação em R:** Uso dos pacotes `raster`, `rgdal` e `sp` para automatizar a leitura dos arquivos TIF e exportar os mapas finais.

> [!TIP]
> **Trecho de Destaque do Artigo:**
> *"A determinação da severidade da queima não indica apenas o dano físico superficial imediato na biomassa foliar, mas está diretamente correlacionada à perda de nutrientes do solo, ao risco iminente de erosão hídrica e à capacidade de regeneração natural da vegetação nativa no pós-fogo."*
> 
> *Explicação:* Esse tutorial serve como uma "receita pronta" para um capítulo prático de TCC. Se o objetivo for calcular a severidade de um incêndio em qualquer parque brasileiro, este tutorial fornece o embasamento teórico e o passo a passo de cálculo exato.

### Resultados
- Fornece um método universalmente aceito pela comunidade científica internacional para quantificar danos causados por fogo florestal.
- Demonstra que estudantes de graduação podem gerar laudos e mapas de severidade sem necessitar de softwares pagos como ArcGIS ou ENVI.

---

## 9. Segmentação Semântica de Incêndios Florestais com U-Net e Encoders Pré-Treinados
- **Arquivo:** `portugues/geral/segmentacao-e-deep-learning/UFU_Dissertacao_SegmentacaoSemanticaIncendios.pdf`
- **Autora / Instituição:** Natália de Oliveira Gomes (Dissertação de Mestrado em Ciência da Computação, Universidade Federal de Uberlândia — UFU, 2025)

### Resumo
Esta dissertação investiga o uso de visão computacional profunda (Deep Learning) para segmentação semântica de áreas queimadas em imagens de satélite Sentinel-2. O foco principal da pesquisa foi mitigar os efeitos do severo desbalanceamento de classes (pixels de fogo cobrem uma fração ínfima das cenas orbitais) por meio de arquiteturas U-Net com encoders modernos e uma função de perda composta por *Focal Loss* e *Dice Loss*.

### Materiais e métodos
- **Dados:** Dataset de imagens multiespectrais Sentinel-2 (resolução de 20m), contendo composições espectrais direcionadas à detecção de queimadas (B12, B8A e B4).
- **Arquitetura de Rede:** Arquitetura U-Net acoplada a *backbones* de redes pré-treinadas no ImageNet: **VGG16**, **ResNet50** e **EfficientNet-B3**.
- **Função de Perda Proposta (Composta):**
  $$\mathcal{L}_{\text{composta}} = \alpha \cdot \mathcal{L}_{\text{Focal}} + \beta \cdot \mathcal{L}_{\text{Dice}}$$
  A *Focal Loss* força a rede a focar nos exemplos difíceis (bordas de queima), enquanto a *Dice Loss* atua diretamente na otimização da sobreposição espacial.
- **Métricas:** *Intersection over Union* (IoU), *F1-Score*, *Precision* e *Recall*.

> [!TIP]
> **Trecho de Destaque do Artigo:**
> *"Ao trabalhar com sensoriamento remoto de incêndios, a função Cross-Entropy tradicional falha porque o modelo atinge 98% de acurácia simplesmente classificando toda a imagem como 'fundo não queimado'. O balanceamento por Focal Loss ajusta o peso dos gradientes dos pixels raros, permitindo que a U-Net identifique focos dispersos e cicatrizes pequenas que passariam despercebidas."*
> 
> *Explicação:* Se o seu TCC optar por usar Deep Learning para segmentação de queimadas, você **não deve** usar Cross-Entropy pura. O uso de Dice Loss ou Focal Loss é indispensável para evitar previsões nulas.

### Resultados
- A configuração **U-Net + EfficientNet-B3** com perda composta alcançou os melhores resultados globais: **F1-Score de 91,4%** e **IoU de 84,2%**.
- A rede superou limiares fixos de NBR, demonstrando capacidade de não confundir corpos d'água escuros, sombras de nuvem e solos agrícolas arados com áreas queimadas reais.
- Alerta para TCC: exige acesso a GPUs (como Google Colab com GPU T4/A100) e conhecimento prévio de PyTorch/TensorFlow.

---

## 10. Anais do XX Simpósio Brasileiro de Sensoriamento Remoto (SBSR 2023)
- **Arquivo:** `portugues/geral/anais-de-eventos/SBSR_2023_Trabalhos_Aprovados.pdf`
- **Instituição / Evento:** Sociedade Brasileira de Sensoriamento Remoto (XX SBSR, 2023)

### Resumo
Relação oficial de trabalhos aprovados no principal evento acadêmico de sensoriamento remoto do Brasil. O documento apresenta um panorama completo dos temas, metodologias, satélites e algoritmos adotados pelos maiores grupos de pesquisa florestal e geoinformação do país (INPE, Embrapa, Universidades Federais).

### Materiais e métodos
- **Fontes Tecnológicas em Destaque:** Amplo uso da plataforma **Google Earth Engine (GEE)**, dados da constelação **Copernicus (Sentinel-1 e Sentinel-2)**, dados **Landsat (USGS)**, satélites sino-brasileiros **CBERS-4/4A** e constelação **PlanetScope** (Programa Brasil MAIS/Polícia Federal).
- **Abordagens Estatísticas:** Algoritmos de Machine Learning (destacando-se amplamente o **Random Forest** e o **XGBoost**) para classificação de uso da terra e mapeamento de distúrbios de fogo.

> [!TIP]
> **Trecho de Destaque do Panorama:**
> *"A análise das pesquisas nacionais revela que mais de 70% dos trabalhos aplicados a desastres florestais e monitoramento da cobertura vegetal no Brasil hoje utilizam scripts no Google Earth Engine com dados abertos do Sentinel-2 e coleções do MapBiomas, confirmando esse ambiente como o padrão-ouro de reprodutibilidade no país."*
> 
> *Explicação:* Serve como respaldo bibliográfico irrefutável para a banca: adotar Sentinel-2 + GEE + Random Forest/NBR está exatamente na fronteira metodológica do que é produzido nas universidades brasileiras.

### Resultados
- Demonstração do alinhamento metodológico nacional: preferência por metodologias de baixo custo, dados abertos e ferramentas acessíveis em nuvem.
- Consolidação do Google Earth Engine como a plataforma preferida para trabalhos de conclusão de curso e pós-graduação no Brasil.

---

## 💡 Lições e Recomendações Práticas para o seu TCC

Com base nos 10 trabalhos em português analisados, destacam-se três rotas metodológicas claras para o seu TCC, dependendo do seu foco:

1. **Rota 1: Análise Preditiva de Suscetibilidade e Risco (Altamente Recomendada)**
   - *Inspiração:* Gabriel Carvalho (UFES) e Revisão CBMERJ.
   - *Como fazer:* Selecionar uma área de estudo (um Parque, Município ou Bacia Hidrográfica); levantar dados topográficos (SRTM), de vegetação (NDVI/MapBiomas), meteorológicos e de proximidade de estradas; aplicar **Random Forest** (em Python via `scikit-learn`) ou **Lógica Fuzzy** no QGIS.
   - *Vantagem:* Metodologia sólida, fácil de validar (com curvas ROC/AUC), computacionalmente leve e muito valorizada por bancas.

2. **Rota 2: Delimitação e Severidade de Cicatrizes Pós-Fogo (A Mais Simples e Direta)**
   - *Inspiração:* Pirajá et al. (RA'EGA) e GeoSaber / UN-SPIDER.
   - *Como fazer:* Escolher um evento de queimada de grande porte ocorrido no Cerrado/Pantanal; baixar duas cenas Sentinel-2 (pré e pós); calcular NBR e $\Delta$NBR no QGIS; gerar mapas de severidade e cruzar com os dados de focos de calor do INPE.
   - *Vantagem:* Não requer código nem treinamento de IA; usa apenas álgebra de mapas no QGIS e tem visual cartográfico impressionante.

3. **Rota 3: Segmentação Semântica com Deep Learning (Mais Avançada / Viés Computação)**
   - *Inspiração:* Natália Gomes (UFU) e Silva & Santos (SBIAGRO).
   - *Como fazer:* Treinar uma rede **U-Net** com *backbone* pré-treinado no PyTorch via Google Colab para detecção automática de queimadas em imagens Sentinel-2.
   - *Atenção:* Exige atenção obrigatória à função de perda (usar *Dice Loss* ou *Focal Loss* devido ao desbalanceamento de classes).
