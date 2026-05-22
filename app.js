const THEME_STORAGE_KEY = "mapa-processual-theme";

let processos = {};

function aplicarTema(theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  atualizarBotaoTema(isDark);
}

function alternarTema() {
  const isDark = document.documentElement.classList.contains("dark");
  aplicarTema(isDark ? "light" : "dark");
}

function atualizarBotaoTema(isDark) {
  $("#themeToggle .theme-icon-dark").toggleClass("hidden", !isDark);
  $("#themeToggle .theme-icon-light").toggleClass("hidden", isDark);
  $("#themeToggle .theme-toggle-label").text(
    isDark ? "Modo claro" : "Modo escuro",
  );
  $("#themeToggle").attr(
    "aria-label",
    isDark ? "Ativar modo claro" : "Ativar modo escuro",
  );
}

async function carregarProcessos() {
  try {
    const response = await fetch("./processos.json");

    processos = await response.json();

    // processo inicial
    renderProcesso("consulta");
    $(".process-btn[data-process='consulta']").addClass("active");
  } catch (error) {
    console.error("Erro ao carregar JSON:", error);
  }
}

function renderProcesso(key) {
  $(".process-btn").removeClass("active");
  $(`.process-btn[data-process='${key}']`).addClass("active");
  const processo = processos[key];

  if (!processo) return;
  let documentosHTML = processo.documentos.length
    ? processo.documentos
        .map(
          (doc, index) => `
    <div class="glass rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <div class="flex items-center gap-3">
      <span class="min-w-[42px] h-[42px]
                    rounded-xl bg-yellow-500/10
                    flex items-center justify-center text-yellow-600 dark:text-yellow-400">
          ${index + 1}
      </span>

        <div>

          <p class="text-slate-600 dark:text-slate-400 text-sm leading-6">
            ${doc}
          </p>

        </div>

      </div>
    </div>
  `,
        )
        .join("")
    : `
    <div class="glass rounded-2xl p-6 border border-slate-200 dark:border-slate-700 md:col-span-2">
      <p class="text-slate-600 dark:text-slate-400 text-sm leading-6">
        Nenhum documento é necessário para este processo.
      </p>
    </div>
  `;

  let etapasHTML = processo.etapas
    .map(
      (etapa, index) => `
    <div class="relative pl-14 pb-10">

      <div class="absolute left-0 top-0 w-9 h-9 rounded-full
                  bg-yellow-500 text-black font-bold
                  flex items-center justify-center z-10">

        ${index + 1}

      </div>

      <div class="glass rounded-2xl p-6 border border-slate-200 dark:border-slate-700">

        <div class="relative mb-3">

          <h4 class="text-lg font-bold w-[calc(100%-90px)]">
            ${etapa.titulo}
          </h4>

          <span class="text-xs uppercase tracking-light font-bold
                      text-yellow-600 dark:text-yellow-400 bg-yellow-500/10
                      px-3 py-1 rounded-full absolute right-0 top-0">

            ETAPA ${index + 1}

          </span>

        </div>

        <p class="text-slate-600 dark:text-slate-400 leading-7">
          ${etapa.descricao}
        </p>

      </div>

    </div>
  `,
    )
    .join("");

  $("#contentArea").html(`

    <div class="fade-enter">

      <h2 class="text-4xl font-extrabold mb-4">
        ${processo.titulo}
      </h2>

      <p class="text-slate-600 dark:text-slate-400 mb-10 leading-8">
        ${processo.descricao}
      </p>

      <section class="mb-14">

        <h3 class="text-2xl font-bold mb-6">
          Documentação
        </h3>

        <div class="grid md:grid-cols-2 gap-5">
          ${documentosHTML}
        </div>

      </section>

      <section>

        <h3 class="text-2xl font-bold mb-8">
          Fluxo Processual
        </h3>


        <div class="relative timeline-line">

        ${etapasHTML}
      
        <!-- FINAL DO PROCESSO -->
        <div class="relative pl-14">
      
          <!-- ICONE FINAL -->
          <div class="absolute left-0 top-0 w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 
                      text-white font-bold flex items-center justify-center z-10 shadow-lg shadow-emerald-500/30">
            ✓
          </div>
      
          <!-- CARD FINAL -->
          <div class="rounded-3xl p-[1px] bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600">
      
            <div class="bg-white/95 dark:bg-slate-950/95 rounded-3xl p-7">
      
              <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
      
                <div class="flex items-center gap-4">
      
                  <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-2xl">
                    🏛️
                  </div>
      
                  <div>
                    <h4 class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      Processo Finalizado
                    </h4>
      
                    <p class="text-emerald-700/80 dark:text-emerald-200/70 text-sm">
                      Todas as etapas administrativas foram concluídas.
                    </p>
                  </div>
      
                </div>
      
                <div class="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30
                            text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-[3px] font-bold">
                  Concluído
                </div>
      
              </div>
      
              <div class="grid md:grid-cols-3 gap-4 mt-6">
      
                <div class="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-white/5 p-4">
                  <div class="text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-1">
                    Status
                  </div>
      
                  <div class="text-slate-900 dark:text-white font-bold">
                    Finalizado com sucesso
                  </div>
                </div>
      
                <div class="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-white/5 p-4">
                  <div class="text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-1">
                    Fluxo
                  </div>
      
                  <div class="text-slate-900 dark:text-white font-bold">
                    Encerrado
                  </div>
                </div>
      
                <div class="rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-white/5 p-4">
                  <div class="text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-1">
                    Secretaria
                  </div>
      
                  <div class="text-slate-900 dark:text-white font-bold">
                    Processo homologado
                  </div>
                </div>
      
              </div>
      
            </div>
      
          </div>
      
        </div>
      
      </div>
      </section>

    </div>

  `);
}

$(document).ready(function () {
  const temaSalvo = localStorage.getItem(THEME_STORAGE_KEY);
  aplicarTema(temaSalvo === "light" ? "light" : "dark");

  $("#themeToggle").on("click", alternarTema);

  carregarProcessos();

  $(".process-btn").click(function () {
    $(".process-btn").removeClass("active");

    $(this).addClass("active");

    const processo = $(this).data("process");

    renderProcesso(processo);
  });
});
