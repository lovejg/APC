@echo off
cd /d %~dp0

copy nginx.conf ..\nginx\conf\

start /B "" cmd /c "cd  ..\nginx&&nginx -s reload"
pause