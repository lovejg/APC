@echo off

REM the example of running batch files in sequence

START /wait /b cmd /c npm i
START /wait /b cmd /c node producer.js

pause
