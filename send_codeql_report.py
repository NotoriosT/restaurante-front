import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

def send_email(report_path, recipient_email):
    sender_email = "seu_email@example.com"
    sender_password = "sua_senha"

    # Configuração do servidor SMTP
    server = smtplib.SMTP('smtp.example.com', 587)
    server.starttls()
    server.login(sender_email, sender_password)

    # Configuração do e-mail
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = "Relatório de Scan - CodeQL"

    # Corpo do e-mail
    body = "Segue em anexo o relatório de scan gerado pelo CodeQL."
    msg.attach(MIMEText(body, 'plain'))

    # Anexo
    attachment = open(report_path, "rb")
    part = MIMEBase('application', 'octet-stream')
    part.set_payload(attachment.read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', f'attachment; filename= {report_path}')
    msg.attach(part)

    # Envio do e-mail
    server.send_message(msg)
    server.quit()

# Exemplo de uso
report_path = "/caminho/para/relatorio-codeql.html"
recipient_email = "destinatario@example.com"
send_email(report_path, recipient_email)
