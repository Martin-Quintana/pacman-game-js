import http.server
import socketserver
import webbrowser
import threading
import sys
import os
import random
import time

def start_server(port, directory):
    # Ensure we serve from the correct directory (where the exe is)
    os.chdir(directory)
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Serving at port {port}")
        httpd.serve_forever()

def main():
    # If running as exe, get the directory of the exe
    if getattr(sys, 'frozen', False):
        base_dir = os.path.dirname(sys.executable)
    else:
        base_dir = os.path.dirname(os.path.abspath(__file__))

    # Find a free port (randomish range)
    port = 8000 + random.randint(0, 1000)
    
    server_thread = threading.Thread(target=start_server, args=(port, base_dir))
    server_thread.daemon = True
    server_thread.start()

    # Wait a bit for server to start
    time.sleep(1)

    url = f"http://localhost:{port}/index.html"
    print(f"Opening {url}")
    webbrowser.open(url)
    
    # Keep the script running
    print("Game running. Close this window to stop server, but you can keep playing in browser.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Exiting...")

if __name__ == "__main__":
    main()
