# Mail-merge tool Coding Exam.

This repository is a coding exam for Joshua that can upload and import excel, Interpolate variables from excel to templates.

## Installation

Clone the repository 

```bash
git clone https://github.com/Damnval/media_trust.git
```

## Install dependencies

Go to project folder and run 

```bash
composer install
npm install && npm run dev
```

## Development Setup

```bash
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Test Project

Go to browser and type http://127.0.0.1:8000/

## Others

To boost framework speed run and get .env variables to config

```bash
php artisan config:cache
```

