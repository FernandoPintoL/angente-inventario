#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "===================================="
echo " SETUP DATABASE - Sistema Inventario"
echo "===================================="
echo ""

show_menu() {
    echo "Selecciona una opción:"
    echo ""
    echo "1. Limpiar y poblar base de datos (BORRA TODO)"
    echo "2. Solo ejecutar seeders (mantiene datos existentes)"
    echo "3. Solo ejecutar migraciones"
    echo "4. Verificar estado de migraciones"
    echo "5. Salir"
    echo ""
}

migrate_fresh() {
    echo ""
    echo -e "${RED}⚠️  ADVERTENCIA: Esto ELIMINARÁ todos los datos de la base de datos${NC}"
    read -p "¿Estás seguro? (S/N): " confirm

    if [[ $confirm != [sS] ]]; then
        return
    fi

    echo ""
    echo -e "${BLUE}🗑️  Limpiando base de datos...${NC}"
    php artisan migrate:fresh --seed

    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Base de datos poblada exitosamente!${NC}"
        echo ""
        echo -e "${BLUE}📧 Usuario: admin@paucara.test${NC}"
        echo -e "${BLUE}🔑 Contraseña: password${NC}"
    else
        echo ""
        echo -e "${RED}❌ Error al ejecutar migrate:fresh${NC}"
    fi

    echo ""
    read -p "Presiona Enter para continuar..."
}

run_seeders() {
    echo ""
    echo -e "${BLUE}🌱 Ejecutando seeders...${NC}"
    php artisan db:seed

    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Seeders ejecutados exitosamente!${NC}"
    else
        echo ""
        echo -e "${RED}❌ Error al ejecutar seeders${NC}"
        echo ""
        echo "Intenta ejecutar: composer dump-autoload"
    fi

    echo ""
    read -p "Presiona Enter para continuar..."
}

run_migrations() {
    echo ""
    echo -e "${BLUE}📦 Ejecutando migraciones...${NC}"
    php artisan migrate

    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Migraciones ejecutadas exitosamente!${NC}"
    else
        echo ""
        echo -e "${RED}❌ Error al ejecutar migraciones${NC}"
    fi

    echo ""
    read -p "Presiona Enter para continuar..."
}

check_status() {
    echo ""
    echo -e "${BLUE}📊 Estado de las migraciones:${NC}"
    echo ""
    php artisan migrate:status
    echo ""
    read -p "Presiona Enter para continuar..."
}

# Main loop
while true; do
    clear
    echo "===================================="
    echo " SETUP DATABASE - Sistema Inventario"
    echo "===================================="
    echo ""
    show_menu
    read -p "Ingresa el número de opción: " option

    case $option in
        1) migrate_fresh ;;
        2) run_seeders ;;
        3) run_migrations ;;
        4) check_status ;;
        5)
            echo ""
            echo "👋 Saliendo..."
            exit 0
            ;;
        *)
            echo ""
            echo -e "${RED}Opción inválida${NC}"
            sleep 2
            ;;
    esac
done
