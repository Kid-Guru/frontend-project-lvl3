# For GitHub
install:
	npm install

lint:
	npx eslint .

test-coverage:
	npm test -- --coverage --coverageProvider=v8

# For development
test:
	npm test

localtest:
	npx jest --watch

lintfix:
	npx eslint . --fix

publish: 
	npm publish --dry-run

# rebuild: 
# 	npm unlink gendiff
# 	npm publish --dry-run
# 	clear
# 	npm link

.PHONY: test