@echo off
chcp 65001 > nul
title Mantenimiento del PC - Menú Interactivo
color 1F
mode con: cols=80 lines=25


set "LOG=%temp%\astrocode_mantenimiento.log"
echo [%date% %time%] Inicio MantenimientoV.2>> "%LOG%"
:inicio
cls
echo =================================
echo      MANTENIMIENTO DEL PC
echo =================================
echo 1. Limpiar archivos temporales
echo 2. Liberar caché DNS
echo 3. Desfragmentar disco duro
echo 4. Generar informe del sistema
echo 5. Buscar y eliminar malware
echo 6. Vaciar la papelera de reciclaje 🗑️
echo 7. Copia de seguridad
echo 8. Reparar Disco
echo 9. Abrir Scanner
echo 10. Salir
echo =================================
set /p opcion="Selecciona una opción (1-10): "

if "%opcion%" == "1" goto limpiar_temporales
if "%opcion%" == "2" goto liberar_dns
if "%opcion%" == "3" goto desfragmentar
if "%opcion%" == "4" goto generar_informe
if "%opcion%" == "5" goto buscar_malware
if "%opcion%" == "6" goto vaciar_papelera
if "%opcion%" == "7" goto copia_seguridad
if "%opcion%" == "8" goto reparar_disco 
if "%opcion%" == "9" goto abrir_scanner
if "%opcion%" == "10" goto exit


if not "%opcion%"=="" (
  echo.
  echo Opcion invalida. Escribe un numero del 1 al 10.
  pause
)
goto inicio

:limpiar_temporales
echo [%date% %time%] Limpieza temporales>> "%LOG%"
echo Limpiando archivos temporales...
cleanmgr /sagerun:1
echo Archivos temporales eliminados.
pause
goto inicio

:liberar_dns
echo [%date% %time%] Flush DNS>> "%LOG%"
echo Liberando caché de DNS...
ipconfig /flushdns
echo Caché de DNS liberada.
pause
goto inicio

:desfragmentar
echo [%date% %time%] Defrag C>> "%LOG%"
echo Desfragmentando el disco duro...
set /p confirmar="¿Deseas desfragmentar el disco duro? (s/n): "
if /I "%confirmar%"=="s" (
    defrag C: > nul
    echo Desfragmentación completada.
) else (
    echo Desfragmentación omitida.
)
pause
goto inicio

:generar_informe
echo [%date% %time%] Generar informe systeminfo+netstat>> "%LOG%"
echo Generando informe del sistema...
systeminfo > C:\informe_sistema.txt
netstat -ano > C:\netstat_conexiones.txt
if errorlevel 1 (
    echo Hubo un problema al generar el informe. Verifica los permisos.
) else (
    echo Informe guardado como C:\informe_sistema.txt.
)
pause
goto inicio

:buscar_malware
echo [%date% %time%] Escaneo Defender>> "%LOG%"
echo Iniciando búsqueda de malware...
set /p confirmar="¿Deseas usar Windows Defender para buscar malware? (s/n): "
if /I "%confirmar%"=="s" (
    echo Ejecutando escaneo completo. Esto puede tardar varios minutos...
    if exist "%ProgramFiles%\Windows Defender\MpCmdRun.exe" (
    start /b cmd /c "%ProgramFiles%\Windows Defender\MpCmdRun.exe" -Scan -ScanType 2 > "%temp%\FullScanOutput.txt"
) else (
    echo No se encontro MpCmdRun.exe (Windows Defender).>> "%LOG%"
    echo No se encontro Windows Defender en esta ruta.
)
    echo Escaneando... Por favor espera.
    timeout /t 10 > nul
    echo Comprobando resultados...
    type "%temp%\FullScanOutput.txt"
    echo Resultados guardados en: %temp%\FullScanOutput.txt

echo [%date% %time%] Defender salida en %temp%\FullScanOutput.txt>> "%LOG%"
) else (
    echo Escaneo omitido.
)
pause
goto inicio

:vaciar_papelera
echo [%date% %time%] Vaciar papelera>> "%LOG%"
echo Vaciando la papelera de reciclaje...
rd /s /q "%systemdrive%\$Recycle.Bin"
if errorlevel 1 (
    echo Hubo un problema al vaciar la papelera. ¿Estás ejecutando como administrador?
) else (
    echo Papelera de reciclaje vaciada con éxito. 🗑️
)
pause
goto inicio

:copia_seguridad
echo [%date% %time%] Copia seguridad xcopy>> "%LOG%"
echo Iniciando copia de seguridad...
set /p origen="Introduce la ruta de la carpeta a respaldar: "
set /p destino="Introduce la ruta de destino para la copia de seguridad: "
xcopy "%origen%" "%destino%" /E /H /C /I
echo Copia de seguridad completada.
pause
goto inicio

:reparar_disco
echo [%date% %time%] CHKDSK>> "%LOG%"
echo =================================
echo         REPARACIÓN DE DISCO
echo =================================
set /p unidad="Introduce la letra de la unidad a reparar (ejemplo: C): "
echo Iniciando reparación de errores en el disco %unidad%...
chkdsk %unidad%: /F /R
if errorlevel 1 (
    echo Hubo un problema durante la reparación. Verifica los permisos.
) else (
    echo Reparación completada con éxito.
)
pause
goto inicio


:abrir_scanner
echo [%date% %time%] Abrir Scanner>> "%LOG%"
call Scanner.bat

goto inicio


:exit
exit
