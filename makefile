run:
	docker run --rm -p 3000:3000 pyoey/ui-project

run-interactive:
	docker run --rm -it --name ui-project-container pyoey/ui-project bash

copy-code:
	@echo
	@echo "\e[1;7mRun: make copy-code DIR=\"/path/to/dir\""
	@echo "Eg: make copy-code DIR=\"./temp\"\e[0m"
	@echo
	docker cp -a ui-project-container:/opt/frontend $(DIR)

build-docker:
	docker build -t pyoey/ui-project
