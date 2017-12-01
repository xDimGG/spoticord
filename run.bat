@echo off

if not exist "%~dp0/node_modules" (
	echo Installing Dependencies
	echo Run this file again after it closes
	npm i
)

cls

echo Launching app.js (Don't worry about warnings)
echo.
:loop
node "%~dp0/app.js"
goto loop