export const deployTemplate = {
  generate(): readonly string[] {
    return [
      "Dockerfile",
      "docker-compose.yml",
      "nginx.conf",
      "github-actions.yml",
      ".env.example",
    ];
  },
};
