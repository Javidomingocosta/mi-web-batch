@echo off
chcp 65001 > nul
title Mantenimiento del PC - Menú Interactivo
color 1F
mode con: cols=80 lines=25


set "LOG=%temp%\astrocode_mantenimiento.log"
echo [%date% %time%] Inicio Scanner>> "%LOG%"
:inicio
cls
echo =================================
echo      MANTENIMIENTO DEL PC
echo =================================
echo 1. Verificar _ archivos
echo 2. Reparar _ archivos
echo 3. Volver
echo =================================
set /p opcion="Selecciona una opción (1-3): "

if "%opcion%" == "1" goto verificar_archivos
if "%opcion%" == "2" goto reparar_archivos
if "%opcion%" == "3" goto volver


:verificar_archivos
echo [%date% %time%] SFC VERIFYONLY>> "%LOG%"
echo =================================
echo         Verificando archivos
echo =================================
sfc /VERIFYONLY
echo Archivos verificados
pause
goto inicio

:reparar_archivos
echo [%date% %time%] SFC SCANNOW>> "%LOG%"
echo =================================
echo         Reparando archivos
echo =================================
sfc /SCANNOW
echo Archivos reparados
pause
goto inicio

:volver
 echo Volviendo al mantenimiento...
 echo [%date% %time%] Salir Scanner>> "%LOG%"
 exit /b
