@echo off
set archivo=readme.txt
if exist "%archivo%" (
  echo Encontrado: %archivo%
) else (
  echo No existe: %archivo%
)
pause
