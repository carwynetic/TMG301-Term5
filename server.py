#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TMG301 Master Exam Prep - Local HTTP Server
Run this script to launch the local web server at http://localhost:8000.
Zero external dependencies (uses standard library http.server).
"""

import os
import sys
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

PORT = 8000
HOST = "127.0.0.1"

class CustomHTTPHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and caching headers for seamless local development
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format, *args):
        # Clean terminal logging
        sys.stdout.write(f"[{self.log_date_time_string()}] {format % args}\n")
        sys.stdout.flush()

def run_server():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base_dir)

    server_address = (HOST, PORT)
    httpd = HTTPServer(server_address, CustomHTTPHandler)

    url = f"http://localhost:{PORT}"
    print("=" * 70)
    print("[*] TMG301 Text Mining Exam Prep - Local Portal")
    print(f"[*] Server running at: {url}")
    print(f"[*] Root directory:    {base_dir}")
    print("[*] Opening your web browser automatically...")
    print("[*] Press Ctrl + C in this window to stop the server.")
    print("=" * 70)

    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"Could not open browser automatically: {e}")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Stopping server...")
        httpd.server_close()
        print("[+] Server stopped. Good luck with your TMG301 exam!")

if __name__ == "__main__":
    run_server()
