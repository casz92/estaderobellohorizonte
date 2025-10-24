# today_request.py
import requests

url = "https://www.estaderobellohorizonte.com/_functions/today"

try:
    response = requests.get(url)
    response.raise_for_status()
    print("Respuesta:", response.text)
except requests.exceptions.RequestException as e:
    print("Error:", e)