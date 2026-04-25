import streamlit as st
import numpy as np
import pandas as pd
import plotly.graph_objects as go
import time

# ---------------- CONFIGURACIÓN ----------------
st.set_page_config(page_title="PPL OS - Deep Vision", layout="wide", initial_sidebar_state="collapsed")

# Estilo de Terminal Hacker / Hyprland
st.markdown("""
<style>
    .terminal-font { font-family: 'Fira Code', 'Courier New', monospace; color: #00ff66; line-height: 1.4; }
    .theory-box { background-color: #1a1b26; padding: 20px; border-left: 5px solid #7aa2f7; border-radius: 5px; color: #a9b1d6; }
    .stMetric { background-color: #16161e; padding: 15px; border-radius: 10px; border: 1px solid #2ac3de; }
</style>
""", unsafe_allow_html=True)

# ---------------- ESTADO DEL SISTEMA ----------------
if "page" not in st.session_state:
    st.session_state.page = "Dashboard Central"
if "history" not in st.session_state:
    st.session_state.history = [
        "> Inicio del sistema...",
        "> Analizando PPL... ¡ALERTA!",
        ">>> help",
        "Comandos: graficar | simplex | simular | corregir | vision3d | teoria | clear"
    ]
if "cmd_input" not in st.session_state:
    st.session_state.cmd_input = ""

# ---------------- LÓGICA DE COMANDOS ----------------
def run_command():
    cmd = st.session_state.cmd_input.lower().strip()
    mapping = {
        "graficar": "Visualización 2D",
        "simplex": "Motor Simplex",
        "simular": "Simulador de Crecimiento",
        "corregir": "Parche de Acotamiento",
        "vision3d": "Exploración 3D",
        "teoria": "Núcleo de Teoría",
        "hipotesis": "Panel de Hipótesis"
    }
    
    if cmd in mapping:
        st.session_state.page = mapping[cmd]
        st.session_state.history.append(f">>> {cmd}")
        st.session_state.history.append(f"→ Accediendo a {mapping[cmd]}...")
    elif cmd == "teoria":
        st.session_state.page = "Núcleo de Teoría"
        st.session_state.history.append(">>> teoria")
        st.session_state.history.append("→ Cargando marcos teóricos de optimización...")
    elif cmd == "clear":
        st.session_state.history = ["> Terminal reseteada."]
    elif cmd == "help":
        st.session_state.history.append(">>> help")
        st.session_state.history.append("Comandos: graficar | simplex | simular | corregir | vision3d | teoria | clear")
    else:
        st.session_state.history.append(f">>> {cmd}")
        st.session_state.history.append("❌ Comando no válido.")
    
    st.session_state.cmd_input = "" # Limpia la barra de texto

# ---------------- HEADER ----------------
st.title("⚠️ PPL OS: Anomalía de No Acotamiento")
st.markdown("---")

# ---------------- LAYOUT PRINCIPAL ----------------
col_terminal, col_visor = st.columns([1, 2.5])

# === COLUMNA IZQUIERDA: TERMINAL ===
with col_terminal:
    st.subheader("💻 Terminal PPL OS")
    st.text_input("Ingresa comando:", key="cmd_input", on_change=run_command)
    
    # Visor de la consola
    terminal_output = "\n".join(st.session_state.history[-12:]) # Muestra las últimas 12 líneas
    st.markdown(f"""
    <div style="background-color: #1a1b26; padding: 15px; border-radius: 8px; border: 1px solid #414868; height: 320px; overflow-y: hidden;">
        <span class="terminal-font">{terminal_output.replace(chr(10), '<br>')}</span>
        <span class="terminal-font" style="animation: blink 1s infinite;">_</span>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("### 🧭 Accesos Directos")
    col_btn1, col_btn2 = st.columns(2)
    with col_btn1:
        if st.button("📘 Teoría", use_container_width=True): st.session_state.page = "Núcleo de Teoría"
        if st.button("🤔 Hipótesis", use_container_width=True): st.session_state.page = "Panel de Hipótesis"
        if st.button("📊 Graficar", use_container_width=True): st.session_state.page = "Visualización 2D"
        if st.button("🌐 Visión 3D", use_container_width=True): st.session_state.page = "Exploración 3D"
    with col_btn2:
        if st.button("🧠 Simplex", use_container_width=True): st.session_state.page = "Motor Simplex"
        if st.button("🚀 Simular", use_container_width=True): st.session_state.page = "Simulador de Crecimiento"
        if st.button("🛠️ Corregir", use_container_width=True): st.session_state.page = "Parche de Acotamiento"

# === COLUMNA DERECHA: VISUALIZADOR MULTIMÓDULO ===
with col_visor:
    page = st.session_state.page
    
    # -- 1. DASHBOARD CENTRAL --
    if page == "Dashboard Central":
        st.error("🚨 **DIAGNÓSTICO:** El problema actual no posee un límite en la dirección de la función objetivo. El valor de Z tiende a infinito.")
        st.info("👈 Utiliza la terminal o los botones de la izquierda para explorar este fenómeno.")

    # -- 2. NÚCLEO DE TEORÍA --
    elif page == "Núcleo de Teoría":
        st.header("📘 Teoría: La Anatomía del Infinito")
        st.markdown("""
        <div class="theory-box">
        <h3>¿Cuándo un PPL es no acotado?</h3>
        Matemáticamente, ocurre cuando existe una dirección <b>d</b> tal que:
        <ul>
            <li><b>A·d ≤ 0:</b> La dirección nunca viola ni choca con las restricciones.</li>
            <li><b>cᵀ·d > 0:</b> La función objetivo mejora infinitamente al moverse en esa dirección.</li>
        </ul>
        <hr>
        <b>En el Método Simplex:</b>
        <p>Al intentar pivotar, la variable entrante (que promete mejorar Z) se encuentra con que toda su columna bajo la base es <b>≤ 0</b>. Esto significa que no hay ninguna variable básica que la frene. No hay variable de salida.</p>
        <hr>
        <b>Dualidad:</b>
        <p>Si el problema Primal es no acotado, su problema Dual correspondiente es matemáticamente <b>infactible</b>.</p>
        </div>
        """, unsafe_allow_html=True)

    # -- 3. EXPLORACIÓN 3D --
    elif page == "Exploración 3D":
        st.header("🌐 Visión 3D: El Plano Ascendente")
        st.write("El plano de color representa tu función objetivo $Z$. Observa cómo sube por el 'pasillo' de la región factible sin encontrar jamás un 'techo'.")
        
        # Inputs interactivos para el modelo
        st.subheader("Define tu Modelo Matemático")
        col1, col2 = st.columns(2)
        with col1:
            c1_3d = st.number_input("Coeficiente de X1 en Z", value=2.0, step=0.1, key="c1_3d")
            a1_3d = st.number_input("Coeficiente de X1 en restricción", value=0.5, step=0.1, key="a1_3d")
        with col2:
            c2_3d = st.number_input("Coeficiente de X2 en Z", value=2.0, step=0.1, key="c2_3d")
            b1_3d = st.number_input("Término independiente en restricción", value=2.0, step=0.1, key="b1_3d")
        
        st.latex(f"\\max Z = {c1_3d} x_1 + {c2_3d} x_2")
        st.latex(f"Sujeto a: {a1_3d} x_1 + x_2 \\geq {b1_3d}")
        
        x = np.linspace(0, 50, 30)
        y = np.linspace(0, 50, 30)
        X, Y = np.meshgrid(x, y)
        
        Z_obj = c1_3d*X + c2_3d*Y # Función objetivo
        Z_visible = np.where(Y >= a1_3d*X + b1_3d, Z_obj, np.nan) # Restricción abierta

        fig = go.Figure(data=[
            go.Surface(x=X, y=Y, z=Z_visible, colorscale='Viridis', opacity=0.8, name='Z Objetivo'),
            go.Contour(x=x, y=y, z=Z_visible, line_width=0, opacity=0.3, colorscale='Greens', showscale=False)
        ])

        fig.update_layout(
            scene=dict(
                xaxis_title='Variable X1', yaxis_title='Variable X2', zaxis_title='Valor de Z',
                xaxis=dict(backgroundcolor="rgb(20, 20, 30)", gridcolor="gray"),
                yaxis=dict(backgroundcolor="rgb(20, 20, 30)", gridcolor="gray"),
                zaxis=dict(backgroundcolor="rgb(20, 20, 30)", gridcolor="gray"),
            ),
            template="plotly_dark", margin=dict(l=0, r=0, b=0, t=20), height=500
        )
        st.plotly_chart(fig, use_container_width=True)
        st.warning("🔄 Puedes hacer clic y arrastrar para rotar la cámara en 3D.")

    # -- 4. VISUALIZACIÓN 2D --
    elif page == "Visualización 2D":
        st.header("📊 Región Factible Abierta")
        st.write("Observa cómo la región verde (el área factible) se extiende hacia arriba y la derecha.")
        
        # Inputs interactivos para el modelo
        st.subheader("Define tu Modelo Matemático")
        col1, col2 = st.columns(2)
        with col1:
            c1 = st.number_input("Coeficiente de X1 en Z", value=2.0, step=0.1, key="c1_2d")
            a1 = st.number_input("Coeficiente de X1 en restricción", value=0.5, step=0.1, key="a1_2d")
        with col2:
            c2 = st.number_input("Coeficiente de X2 en Z", value=2.0, step=0.1, key="c2_2d")
            b1 = st.number_input("Término independiente en restricción", value=5.0, step=0.1, key="b1_2d")
        
        st.latex(f"\\max Z = {c1} x_1 + {c2} x_2")
        st.latex(f"Sujeto a: {a1} x_1 + x_2 \\geq {b1}")
        
        fig = go.Figure()
        x_val = np.linspace(0, 100, 100)
        y_val = a1 * x_val + b1  # y >= a1*x + b1
        
        fig.add_trace(go.Scatter(x=x_val, y=y_val, mode='lines', line=dict(color='white', width=3), name='Restricción'))
        fig.add_trace(go.Scatter(x=np.concatenate([x_val, x_val[::-1]]),
                                 y=np.concatenate([y_val, [100]*100]),
                                 fill='toself', fillcolor='rgba(0, 255, 100, 0.15)',
                                 line=dict(color='rgba(255,255,255,0)'),
                                 hoverinfo="skip", showlegend=False))
        
        fig.add_annotation(x=80, y=80, ax=40, ay=40, xref="x", yref="y",
                           text="Z crece hacia ∞", showarrow=True, arrowhead=3, arrowsize=2, arrowcolor="red", font=dict(color="red", size=16))
                           
        fig.update_layout(template="plotly_dark", height=450, xaxis_range=[0, 100], yaxis_range=[0, 100])
        st.plotly_chart(fig, use_container_width=True)

    # -- 5. SIMULADOR DE CRECIMIENTO --
    elif page == "Simulador de Crecimiento":
        st.header("🚀 Exploración del Rayo")
        st.write("Mueve el slider para viajar. La función objetivo nunca dejará de crecer.")
        
        # Inputs interactivos para el modelo
        st.subheader("Define tu Modelo Matemático")
        col1, col2 = st.columns(2)
        with col1:
            c1_sim = st.number_input("Coeficiente de X1 en Z", value=10.0, step=1.0, key="c1_sim")
            a1_sim = st.number_input("Coeficiente de X1 en restricción", value=0.5, step=0.1, key="a1_sim")
        with col2:
            c2_sim = st.number_input("Coeficiente de X2 en Z", value=20.0, step=1.0, key="c2_sim")
            b1_sim = st.number_input("Término independiente en restricción", value=5.0, step=0.1, key="b1_sim")
        
        st.latex(f"\\max Z = {c1_sim} x_1 + {c2_sim} x_2")
        st.latex(f"Sujeto a: {a1_sim} x_1 + x_2 \\geq {b1_sim}")
        
        paso = st.slider("Acelerar a través de la región factible", 0, 500, 0, step=10)
        x1_actual = paso
        x2_actual = a1_sim * paso + b1_sim
        z = c1_sim * x1_actual + c2_sim * x2_actual
        
        c1, c2 = st.columns(2)
        c1.metric("Valor Actual de Z", f"${z:,.2f}", f"+{z} (Crecimiento)")
        c2.metric("Coordenadas (x1, x2)", f"({x1_actual}, {x2_actual})")
        
        fig = go.Figure()
        x_val = np.linspace(0, max(100, paso+20), 100)
        y_val = a1_sim * x_val + b1_sim
        fig.add_trace(go.Scatter(x=x_val, y=y_val, mode='lines', line=dict(color='rgba(255,255,255,0.3)')))
        fig.add_trace(go.Scatter(x=[x1_actual], y=[x2_actual], mode='markers', 
                                 marker=dict(size=20, color='red', symbol='star'), name='Posición Actual'))
        fig.update_layout(template="plotly_dark", height=350)
        st.plotly_chart(fig, use_container_width=True)

    # -- 6. MOTOR SIMPLEX --
    elif page == "Motor Simplex":
        st.header("🧠 Falla en la Tabla Simplex")
        st.write("El algoritmo colapsa al intentar buscar una variable de salida. En la columna pivote **no hay ningún valor positivo**.")
        
        # Inputs interactivos para el modelo
        st.subheader("Define tu Modelo Matemático")
        col1, col2, col3 = st.columns(3)
        with col1:
            c1_sx = st.number_input("Coeficiente de X1 en Z", value=-10.0, step=1.0, key="c1_sx")
            a11 = st.number_input("X1 en Restricción 1", value=1.0, step=1.0, key="a11")
            a21 = st.number_input("X1 en Restricción 2", value=-2.0, step=1.0, key="a21")
        with col2:
            c2_sx = st.number_input("Coeficiente de X2 en Z", value=-20.0, step=1.0, key="c2_sx")
            a12 = st.number_input("X2 en Restricción 1", value=-1.0, step=1.0, key="a12")
            a22 = st.number_input("X2 en Restricción 2", value=-3.0, step=1.0, key="a22")
        with col3:
            b1 = st.number_input("RHS Restricción 1", value=10.0, step=1.0, key="b1")
            b2 = st.number_input("RHS Restricción 2", value=15.0, step=1.0, key="b2")
        
        st.latex(f"\\max Z = {c1_sx} x_1 + {c2_sx} x_2")
        st.latex(f"Restricción 1: {a11} x_1 + {a12} x_2 \\leq {b1}")
        st.latex(f"Restricción 2: {a21} x_1 + {a22} x_2 \\leq {b2}")
        
        if st.button("Ejecutar Iteración Algorítmica", type="primary"):
            with st.spinner('Evaluando vector entrante...'):
                time.sleep(1)
            
            data = {
                "Base": ["S1", "S2", "Z"],
                "X1": [a11, a21, c1_sx],
                "X2 (Entrante)": [a12, a22, c2_sx], 
                "Solución": [b1, b2, 0]
            }
            df = pd.DataFrame(data)
            
            def highlight_pivot(s):
                if s.name == 'X2 (Entrante)':
                    return ['background-color: rgba(255,50,50,0.4); color: white'] * len(s)
                return [''] * len(s)
            
            st.dataframe(df.style.apply(highlight_pivot), use_container_width=True)
            st.error(r"❌ **SYSTEM HALT:** X2 es la variable entrante (coeficiente -20 en Z), pero todos los coeficientes en su columna son $\le 0$ (-1, -3). No existe variable limitante para salir de la base.")

    # -- 6.5 PANEL DE HIPÓTESIS --
    elif page == "Panel de Hipótesis":
        st.header("🤔 Panel de Hipótesis Interactivo")
        st.write("Vamos a investigar por qué el modelo es no acotado. Responde las preguntas para validar hipótesis de manera interactiva.")
        
        # Estado para el cuestionario
        if "hypothesis_step" not in st.session_state:
            st.session_state.hypothesis_step = 0
        if "hypothesis_answers" not in st.session_state:
            st.session_state.hypothesis_answers = {}
        
        step = st.session_state.hypothesis_step
        
        # Pregunta 1: ¿El problema es de maximización o minimización?
        if step == 0:
            st.subheader("Paso 1: Naturaleza del problema")
            st.write("¿Estás maximizando o minimizando la función objetivo?")
            opt = st.radio("Selecciona:", ["Maximizar", "Minimizar"], key="q1")
            if st.button("Siguiente"):
                st.session_state.hypothesis_answers["tipo"] = opt
                st.session_state.hypothesis_step = 1
                st.rerun()
        
        # Pregunta 2: ¿Hay restricciones de recursos?
        elif step == 1:
            st.subheader("Paso 2: Restricciones de recursos")
            st.write("¿El modelo incluye límites en recursos como tiempo, presupuesto o capacidad?")
            opt = st.radio("Selecciona:", ["Sí, hay límites claros", "No, asumo recursos ilimitados", "No estoy seguro"], key="q2")
            if st.button("Siguiente"):
                st.session_state.hypothesis_answers["recursos"] = opt
                st.session_state.hypothesis_step = 2
                st.rerun()
            if st.button("Atrás"):
                st.session_state.hypothesis_step = 0
                st.rerun()
        
        # Pregunta 3: ¿Hay demanda limitada?
        elif step == 2:
            st.subheader("Paso 3: Límite de demanda")
            st.write("¿El modelo considera un límite en la demanda o ventas?")
            opt = st.radio("Selecciona:", ["Sí, hay techo de demanda", "No, mercado infinito", "Depende de factores externos"], key="q3")
            if st.button("Siguiente"):
                st.session_state.hypothesis_answers["demanda"] = opt
                st.session_state.hypothesis_step = 3
                st.rerun()
            if st.button("Atrás"):
                st.session_state.hypothesis_step = 1
                st.rerun()
        
        # Pregunta 4: Verificación de errores
        elif step == 3:
            st.subheader("Paso 4: Verificación de errores")
            st.write("¿Revisaste por errores en las desigualdades (ej. ≥ en lugar de ≤)?")
            opt = st.radio("Selecciona:", ["Sí, todo correcto", "No, podría haber errores", "Necesito revisar"], key="q4")
            if st.button("Evaluar"):
                st.session_state.hypothesis_answers["errores"] = opt
                st.session_state.hypothesis_step = 4
                st.rerun()
            if st.button("Atrás"):
                st.session_state.hypothesis_step = 2
                st.rerun()
        
        # Resultado y validación
        elif step == 4:
            st.subheader("Resultado del Análisis")
            answers = st.session_state.hypothesis_answers
            
            # Lógica de validación
            diagnosis = ""
            if answers.get("tipo") == "Maximizar" and answers.get("recursos") in ["No, asumo recursos ilimitados", "No estoy seguro"] and answers.get("demanda") in ["No, mercado infinito", "Depende de factores externos"]:
                diagnosis = "✅ **DIAGNÓSTICO CONFIRMADO:** El problema es no acotado porque maximizas sin límites reales en recursos o demanda. En la vida real, agrega restricciones como capacidad de producción o techo de mercado."
            elif answers.get("errores") in ["No, podría haber errores", "Necesito revisar"]:
                diagnosis = "⚠️ **POSIBLE ERROR:** Revisa las desigualdades. Un ≥ en lugar de ≤ puede causar no acotamiento."
            else:
                diagnosis = "🤔 **ANÁLISIS INCONCLUSO:** El modelo parece correcto, pero verifica si faltan restricciones implícitas. Considera agregar límites de seguridad."
            
            st.markdown(diagnosis)
            
            if st.button("Reiniciar Cuestionario"):
                st.session_state.hypothesis_step = 0
                st.session_state.hypothesis_answers = {}
                st.rerun()

    # -- 7. PARCHE DE ACOTAMIENTO --
    elif page == "Parche de Acotamiento":
        st.header("🛠️ Corrección del Modelo")
        st.write("Para arreglar este PPL, agregamos un 'techo' que cierre el poliedro abierto.")
        
        agregar = st.toggle(r"Activar Restricción: $x_1 + x_2 \le 80$")
        
        fig = go.Figure()
        x_val = np.linspace(0, 100, 100)
        y_val = 5 + x_val * 0.5
        
        fig.add_trace(go.Scatter(x=x_val, y=y_val, mode='lines', line=dict(color='white'), name='Rest. Original'))
        
        if agregar:
            st.success("✅ Problema acotado. El espacio infinito ha sido contenido.")
            y_techo = 80 - x_val
            fig.add_trace(go.Scatter(x=x_val, y=y_techo, mode='lines', line=dict(color='yellow'), name='Rest. Nueva'))
            
            x_poly = [0, 50, 80, 0]
            y_poly = [5, 30, 0, 0]
            fig.add_trace(go.Scatter(x=x_poly, y=y_poly, fill='toself', fillcolor='rgba(0, 255, 100, 0.4)', showlegend=False))
        else:
            fig.add_trace(go.Scatter(x=np.concatenate([x_val, x_val[::-1]]), y=np.concatenate([y_val, [100]*100]),
                                     fill='toself', fillcolor='rgba(255, 0, 0, 0.15)', name='Región Infinita'))

        fig.update_layout(template="plotly_dark", height=450, xaxis_range=[0, 100], yaxis_range=[0, 100])
        st.plotly_chart(fig, use_container_width=True)