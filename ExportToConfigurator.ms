-- Script para exportar position.json compatible con Three.js
-- Convierte el sistema de coordenadas de 3ds Max al sistema usado por Three.js

-- Función para escribir un archivo de texto
fn writeTextFile filename content =
(
    local file = createFile filename
    format "%" content to:file
    close file
)

-- Función para convertir grados a radianes
fn convertDegreesToRadians degrees =
(
    return degrees * (pi / 180.0)
)

-- Función principal para exportar el JSON de posición
fn exportPositionJSON =
(
    -- Verificar si hay objetos seleccionados
    if selection.count == 0 then
    (
        messageBox "Por favor, selecciona al menos un objeto para exportar su posición" title:"Error"
        return false
    )

    -- Solicitar la ruta donde guardar el archivo JSON
    local filePath = getSaveFileName caption:"Guardar archivo position.json" filename:"position.json" types:"JSON (*.json)|*.json|All Files (*.*)|*.*"

    if filePath == undefined then
    (
        messageBox "Exportación cancelada" title:"Información"
        return false
    )

    -- Obtener información de posición, rotación y escala
    local obj = selection[1]
    local pos = obj.pos
    local rot = obj.rotation as eulerAngles
    local scale = obj.scale

    -- Factor de escala para convertir unidades de 3ds Max a Three.js
    -- Puedes ajustar este valor según sea necesario
    local scaleFactor = 1.0

    -- Convertir del sistema de coordenadas de 3ds Max al de Three.js
    -- En Three.js: X = derecha, Y = arriba, Z = hacia el espectador
    -- En 3ds Max: X = derecha, Z = arriba, Y = hacia adelante (desde la vista de frente)
    local threeJSPos = [pos.x * scaleFactor, pos.z * scaleFactor, -pos.y * scaleFactor]

    -- Convertir rotación (en radianes para Three.js)
    -- Necesitamos convertir los ángulos de Euler de 3ds Max a radianes de Three.js
    -- y ajustar según los cambios de ejes
    local threeJSRot = [(degToRad rot.x), (degToRad rot.z), -(degToRad rot.y)]

    -- Escala se mantiene igual
    local threeJSScale = [scale.x, scale.z, scale.y]

    -- Crear el JSON de posición
    local positionData = "{\n"
    positionData += "    \"position\": { \"x\": " + threeJSPos.x as string + ", \"y\": " + threeJSPos.y as string + ", \"z\": " + threeJSPos.z as string + " },\n"
    positionData += "    \"rotation\": { \"x\": " + threeJSRot.x as string + ", \"y\": " + threeJSRot.y as string + ", \"z\": " + threeJSRot.z as string + " },\n"
    positionData += "    \"scale\": { \"x\": " + threeJSScale.x as string + ", \"y\": " + threeJSScale.y as string + ", \"z\": " + threeJSScale.z as string + " }\n"
    positionData += "}"

    -- Guardar el archivo JSON
    writeTextFile filePath positionData

    -- Mensaje de confirmación
    messageBox ("Archivo position.json guardado con coordenadas para Three.js en:\n" + filePath) title:"Exportación completada"
    return true
)

-- Crear interfaz de usuario
try (destroyDialog exportPositionJSONRollout) catch()

rollout exportPositionJSONRollout "Exportar Position JSON para Three.js" width:300
(
    label lblTitle "Exportador de Position JSON" align:#center height:30

    group "Instrucciones:"
    (
        label lbl1 "1. Selecciona el objeto" align:#left
        label lbl2 "2. Haz clic en el botón exportar" align:#left
        label lbl3 "3. Elige dónde guardar el archivo JSON" align:#left
    )

    button btnExport "Exportar position.json" width:250 height:30 align:#center

    on btnExport pressed do
    (
        exportPositionJSON()
    )

    label lblNote "Nota: Este script ajusta las coordenadas para" align:#center
    label lblNote2 "que funcionen correctamente en Three.js" align:#center
)

createDialog exportPositionJSONRollout width:300 height:230
