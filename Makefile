.PHONY: build start

build:
	npm --prefix frontend-project-12 run build

start:
	npx start-server -s ./frontend-project-12/dist
