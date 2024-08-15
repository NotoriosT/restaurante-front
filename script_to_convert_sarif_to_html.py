import json
from sarif_om import SarifLog

# Leitura do arquivo SARIF
with open("results/javascript.sarif/javascript.sarif", "r") as sarif_file:
    sarif_data = json.load(sarif_file)

# Parse do SARIF usando sarif-om
sarif_log = SarifLog.from_dict(sarif_data)

# Geração do HTML
html_content = """
<html>
<head>
    <title>Relatório de Vulnerabilidades</title>
</head>
<body>
    <h1>Relatório de Vulnerabilidades</h1>
    <ul>
"""

for run in sarif_log.runs:
    for result in run.results:
        html_content += f"<li><strong>{result.rule_id}</strong>: {result.message.text}</li>"

html_content += """
    </ul>
</body>
</html>
"""

# Escreve o conteúdo HTML em um arquivo
with open("relatorio_vulnerabilidades.html", "w") as html_file:
    html_file.write(html_content)
