-- server.lua - Servidor HTTP simple para la calculadora
-- API REST para los métodos numéricos

local calculator = require("./calculator")
local json = require("json") or {}

-- Parsear una cadena json simple (implementación básica)
local function parse_json_simple(str)
    local result = {}
    if not str or str == "" then return result end

    -- Remover espacios en blanco
    str = str:gsub("%s+", "")

    -- Parsear objeto simple {"key":"value", "key2":"value2"}
    for key, value in str:gmatch('"([^"]+)":"([^"]+)"') do
        -- Intentar convertir a número
        local num_value = tonumber(value)
        if num_value then
            result[key] = num_value
        else
            result[key] = value
        end
    end

    return result
end

-- Convertir tabla a JSON
local function to_json(t)
    local function serialize(v)
        if type(v) == "number" then
            return tostring(v)
        elseif type(v) == "string" then
            return '"' .. v .. '"'
        elseif type(v) == "boolean" then
            return tostring(v)
        elseif type(v) == "table" then
            local items = {}
            for k, val in pairs(v) do
                if type(k) == "number" then
                    table.insert(items, serialize(val))
                else
                    table.insert(items, '"' .. k .. '":' .. serialize(val))
                end
            end
            
            -- Detectar si es array o objeto
            local is_array = true
            for k in pairs(v) do
                if type(k) ~= "number" then
                    is_array = false
                    break
                end
            end
            
            if is_array then
                return "[" .. table.concat(items, ",") .. "]"
            else
                return "{" .. table.concat(items, ",") .. "}"
            end
        end
        return "null"
    end
    return serialize(t)
end

-- Respuestas HTTP simples
local function respond_ok(body)
    return "HTTP/1.1 200 OK\r\n" ..
           "Content-Type: application/json\r\n" ..
           "Content-Length: " .. #body .. "\r\n" ..
           "Access-Control-Allow-Origin: *\r\n" ..
           "\r\n" .. body
end

local function respond_error(code, message)
    local body = to_json({error = message, code = code})
    return "HTTP/1.1 " .. code .. " Error\r\n" ..
           "Content-Type: application/json\r\n" ..
           "Content-Length: " .. #body .. "\r\n" ..
           "Access-Control-Allow-Origin: *\r\n" ..
           "\r\n" .. body
end

-- Endpoints disponibles
local endpoints = {}

-- GET /api/methods - Listar métodos disponibles
function endpoints.get_methods()
    local methods = calculator.list_methods()
    local response = to_json({
        success = true,
        methods = methods
    })
    return respond_ok(response)
end

-- GET /api/info - Información de la calculadora
function endpoints.get_info()
    local info = calculator.info()
    local response = to_json({
        success = true,
        info = info
    })
    return respond_ok(response)
end

-- POST /api/solve/biseccion
function endpoints.solve_biseccion(params)
    if not params.f or not params.a or not params.b then
        return respond_error(400, "Parámetros requeridos: f, a, b")
    end
    
    -- Crear función desde la expresión (SEGURIDAD: esto es peligroso en producción)
    local f = function(x)
        return load("local x = " .. x .. "; return " .. params.f)()(x)
    end
    
    local root, iterations, msg = calculator.methods.biseccion.solve(
        f,
        tonumber(params.a),
        tonumber(params.b),
        tonumber(params.tolerance) or 1e-10,
        tonumber(params.max_iterations) or 1000
    )
    
    if not root then
        return respond_error(400, msg or "Error en el cálculo")
    end
    
    local response = to_json({
        success = true,
        method = "biseccion",
        root = root,
        iterations = iterations,
        error_message = msg
    })
    
    return respond_ok(response)
end

-- Health check
function endpoints.health()
    local response = to_json({
        status = "ok",
        version = "1.0.0"
    })
    return respond_ok(response)
end

-- Router simple
local function route_request(method, path, body)
    if path == "/health" then
        return endpoints.health()
    elseif path == "/api/methods" and method == "GET" then
        return endpoints.get_methods()
    elseif path == "/api/info" and method == "GET" then
        return endpoints.get_info()
    elseif path == "/api/solve/biseccion" and method == "POST" then
        local params = {}
        if body and body ~= "" then
            -- Parsear JSON simple (muy básico)
            params = parse_json_simple(body)
        end
        return endpoints.solve_biseccion(params)
    else
        return respond_error(404, "Endpoint no encontrado")
    end
end

-- Servidor HTTP muy simple (con sockets)
local function start_server(port)
    port = port or 8080

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("🧮 Super Calculadora Numérica")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("📍 Servidor escuchando en http://localhost:" .. port)
    print("🔗 API Documentation:")
    print("   GET  /health")
    print("   GET  /api/methods")
    print("   GET  /api/info")
    print("   POST /api/solve/biseccion")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("")

    -- Intentar usar socket si está disponible
    local socket_ok, socket = pcall(require, "socket")
    if not socket_ok then
        print("❌ Error: No se puede cargar el módulo 'socket'")
        print("   Instala LuaSocket: luarocks install luasocket")
        print("")
        print("✅ Servidor simulado. Ejemplos:")
        print("")
        print("1️⃣  Listar métodos:")
        print('   curl http://localhost:' .. port .. '/api/methods')
        print("")
        print("2️⃣  Encontrar raíz de x^2 - 2:")
        print('   curl -X POST http://localhost:' .. port .. '/api/solve/biseccion \\')
        print('     -H "Content-Type: application/json" \\')
        print('     -d \'{"f":"x^2-2","a":"1","b":"2"}\'')
        print("")
        return
    end

    -- Crear servidor socket
    local server = socket.tcp()
    server:setoption("reuseaddr", true)
    local bind_ok, bind_err = server:bind("127.0.0.1", port)
    if not bind_ok then
        print("❌ Error al bind: " .. bind_err)
        return
    end

    local listen_ok, listen_err = server:listen(5)
    if not listen_ok then
        print("❌ Error al listen: " .. listen_err)
        return
    end

    print("✅ Servidor HTTP activo. Esperando conexiones...")
    print("   Presiona Ctrl+C para detener")
    print("")

    -- Bucle principal del servidor
    while true do
        local client = server:accept()
        if client then
            client:settimeout(10) -- 10 segundos timeout

            -- Leer request
            local request, err = client:receive("*a")
            if request then
                -- Parsear request básica
                local method, path = request:match("^(%u+)%s+([^%s]+)")
                local body = ""
                local headers = {}

                -- Buscar Content-Length para POST
                local content_length = request:match("Content%-Length:%s*(%d+)")
                if content_length and method == "POST" then
                    -- El body viene después de \r\n\r\n
                    local header_end = request:find("\r\n\r\n")
                    if header_end then
                        body = request:sub(header_end + 4)
                    end
                end

                -- Procesar request
                local response = route_request(method, path, body)

                -- Enviar respuesta
                client:send(response)
            end

            client:close()
        end
    end
end

-- Ejecutar si es el archivo principal
if arg[0]:match("server%.lua$") then
    start_server(8080)
end

return {
    start_server = start_server,
    endpoints = endpoints,
    to_json = to_json
}
