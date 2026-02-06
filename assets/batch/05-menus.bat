@echo off
:menu
cls
echo 1) Opcion A
echo 2) Opcion B
echo 3) Salir
echo.
choice /c 123 /n /m "Elige: "
if errorlevel 3 goto fin
if errorlevel 2 goto b
if errorlevel 1 goto a

:a
echo Elegiste A
pause
goto menu

:b
echo Elegiste B
pause
goto menu

:fin
echo Adios
pause
