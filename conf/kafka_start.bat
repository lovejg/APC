@echo off
cd /d %~dp0
REM the example of running batch files in sequence and in the background
copy zookeeper.properties ..\kafka\config\
copy server1.properties ..\kafka\config\
copy server2.properties ..\kafka\config\
copy server3.properties ..\kafka\config\

start /B "" cmd /c "cd  ..\kafka&&bin\windows\zookeeper-server-start.bat config\zookeeper.properties"
start /B "" cmd /c "cd  ..\kafka&&bin\windows\kafka-server-start.bat config\server1.properties"
start /B "" cmd /c "cd  ..\kafka&&bin\windows\kafka-server-start.bat config\server2.properties"
start /B "" cmd /c "cd  ..\kafka&&bin\windows\kafka-server-start.bat config\server3.properties"


pause