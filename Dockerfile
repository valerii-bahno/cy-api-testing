FROM cypress/base

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install --save-dev cypress

RUN npx cypress verify
CMD ["npm", "run", "cypress:e2e"]