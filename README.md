## Initial Setup

✅ **Laravel Dynamic Env Loader**

We add logic that switches between `.env-int-dev` and `.env` based on the presence of a file named `init-dev`, using Laravel's `->loadEnvironmentVariablesFrom(...)` method in the application bootstrap process.

* It checks if `init-dev` exists in your Laravel root directory.
* If so, Laravel will load **`.env-int-dev`**.
* If not, it defaults to **`.env`**.
* This works for both web routes and Artisan commands.

We modified Laravel's `bootstrap/app.php` to dynamically choose the environment file based on the presence of a custom `init-dev` file. If `init-dev` exists, Laravel loads `.env-int-dev`; otherwise, it defaults to `.env`. This allows flexible environment switching without changing configuration manually.

Additionally, we updated the `config/session.php` file to automatically switch the session driver: it uses `'file'` when `init-dev` exists (for local development) and defaults to `'database'` otherwise. This ensures session handling aligns with the active environment setup without manual `.env` updates.

For detailed instructions on the initial setup, please refer to this guide:
[Getting started with Laravel (as backend)](https://medium.com/@kayydee/got-it-you-want-to-keep-your-react-vite-frontend-completely-separate-inside-a-frontend-folder-58569dc0c624b)

## For local development:

If you cloned or downloaded a Laravel project:

```bash
git clone <repo-url> roadmapv2
cd roadmapv2
composer install
cp .env.example .env 
php artisan key:generate
```

Then configure your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_db
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

Then run:

```bash
php artisan migrate
php artisan serve
```

---


## Build and deploy:

```bash
./deploy.sh
```