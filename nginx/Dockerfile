FROM nginx:alpine

# Remove a configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Cria diretório para os certificados SSL
RUN mkdir -p /etc/nginx/ssl

# Expõe as portas HTTP e HTTPS
EXPOSE 80
EXPOSE 443

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]