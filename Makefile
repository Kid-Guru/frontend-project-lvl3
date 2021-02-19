install:
	npm install

lint:
	npx eslint .

lintfix:
	npx eslint . --fix

localtest:
	npx jest --watch

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

publish: 
	npm publish --dry-run

rebuild: 
	npm unlink gendiff
	npm publish --dry-run
	clear
	npm link

.PHONY: test