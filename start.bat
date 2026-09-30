@echo off
title WORLD MONITOR - AI Security & Monitoring Platform
cd /d "%~dp0"
echo ==================================================
echo  Starting WORLD MONITOR Server...
echo ==================================================
echo Opening http://localhost:3000 in your browser...
start http://localhost:3000
python server.py
pause
