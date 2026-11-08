window.A4_SECTIONS=[
  {
    "id": "start",
    "title": {
      "EN": "Assignment 4",
      "RU": "Задание 4"
    },
    "lead": {
      "EN": "Dynamic programming and string processing.",
      "RU": "Динамическое программирование и обработка строк."
    },
    "body": {
      "EN": "<p>Assignment 4 covers topics from weeks 8–10: dynamic programming, one-pattern search, suffix indexing and dictionary matching. Work through a small example before implementing each method.</p><div class=\"metrics\"><div><strong>6</strong><span>parts · 8 commands</span></div><div><strong>50 + 50</strong><span>practice + defence</span></div><div><strong>15 / 25</strong><span>questions / minutes</span></div></div><h2>Work in this order</h2><ol><li>Read the specification and test the supplied launcher.</li><li>Understand states, updates and boundaries with these small models.</li><li>Implement one module; test its result and reconstruction.</li><li>Compare the three searches on reproducible inputs.</li><li>Submit the exact commit and prepare for the individual defence.</li></ol><p>Use the eight interactive examples to prepare. An ungraded 15-question practice is available in the defence chapter. Create your own repository with <a href=\"https://github.com/RZhaniya/daa-assignment-4-archive/generate\">Use this template</a> on GitHub. The assessed defence is a separate Moodle activity.</p>",
      "RU": "<p>Задание охватывает темы недель 8–10: DP, поиск одного шаблона, суффиксный индекс и поиск словаря. Сначала разберите небольшой пример, затем реализуйте метод.</p><div class=\"metrics\"><div><strong>6</strong><span>частей · 8 команд</span></div><div><strong>50 + 50</strong><span>практика + защита</span></div><div><strong>15 / 25</strong><span>вопросов / минут</span></div></div><h2>Порядок работы</h2><ol><li>Прочитайте задание и проверьте запуск шаблона.</li><li>Разберите состояния, переходы и границы на моделях.</li><li>Реализуйте один модуль; проверьте результат и восстановление.</li><li>Сравните три поиска на воспроизводимых входах.</li><li>Сдайте точный коммит и подготовьтесь к индивидуальной защите.</li></ol><p>Для подготовки разберите восемь интерактивных примеров. Тренировка из 15 вопросов доступна в разделе защиты. Создайте свой репозиторий через <a href=\"https://github.com/RZhaniya/daa-assignment-4-archive/generate\">Use this template</a> на GitHub. Оцениваемая защита проходит отдельно в Moodle.</p>"
    },
    "lab": null
  },
  {
    "id": "foundations",
    "title": {
      "EN": "Dynamic programming",
      "RU": "Динамическое программирование"
    },
    "lead": {
      "EN": "DP remembers the answer to a precisely defined smaller problem.",
      "RU": "DP сохраняет ответ на точно определённую меньшую подзадачу."
    },
    "body": {
      "EN": "<ol><li><strong>State:</strong> what does one entry mean?</li><li><strong>Transition:</strong> which smaller answers determine it?</li><li><strong>Base:</strong> what is already known?</li><li><strong>Order:</strong> when are dependencies ready?</li><li><strong>Correctness:</strong> why do the choices cover every optimum?</li></ol><p>Prefix DP compares prefixes. Interval DP tries a final split. Tree DP combines child states. Fibonacci and 0/1 Knapsack are preparation examples; you do not submit extra implementations for them in A4.</p><details><summary>Memoization and tabulation</summary><p>Memoization stores visited recursive states. Tabulation selects an explicit dependency order. Neither is universally faster or more memory efficient. For knapsack, O(nW) is pseudopolynomial in the numeric capacity.</p></details><h2>Before writing code</h2><p>Name the state in one sentence. Compute one small transition by hand. Identify a boundary and a counterexample to an attractive wrong approach.</p>",
      "RU": "<ol><li><strong>Состояние:</strong> что означает одна ячейка?</li><li><strong>Переход:</strong> какие меньшие ответы определяют её?</li><li><strong>База:</strong> что известно сразу?</li><li><strong>Порядок:</strong> когда зависимости уже готовы?</li><li><strong>Корректность:</strong> почему рассмотрены все варианты оптимума?</li></ol><p>Prefix DP сравнивает префиксы. Interval DP перебирает последний split. Tree DP объединяет состояния детей. Fibonacci и 0/1 Knapsack — подготовка; дополнительные реализации в A4 не сдаются.</p><details><summary>Memoization и tabulation</summary><p>Memoization сохраняет посещённые рекурсивные состояния. Tabulation задаёт явный порядок зависимостей. Ни один способ не всегда быстрее и экономнее. O(nW) для knapsack псевдополиномиально по числовой ёмкости.</p></details><h2>Перед кодом</h2><p>Опишите состояние одним предложением. Вычислите один переход вручную. Найдите границу и контрпример к привлекательному неверному подходу.</p>"
    },
    "lab": null
  },
  {
    "id": "lcs",
    "title": {
      "EN": "Longest common subsequence",
      "RU": "Наибольшая общая подпоследовательность"
    },
    "lead": {
      "EN": "Keep character order; gaps are allowed.",
      "RU": "Порядок символов сохраняется; пропуски разрешены."
    },
    "body": {
      "EN": "<p><code>dp[i][j]</code> is the LCS length of the first i and j characters. A matching last character extends the diagonal. Otherwise take the better of dropping one last character. The zero row and column are zero.</p><p>Reconstruct one common subsequence by following a valid path back through the table. Ties can lead to different correct answers. A long contiguous match is not necessarily an LCS.</p><p><strong>Cost:</strong> O((a+1)(b+1)) time and memory are permitted. <strong>Submit:</strong> length and one optimal sequence.</p>",
      "RU": "<p><code>dp[i][j]</code> — длина LCS первых i и j символов. Совпавший последний символ продолжает диагональ. Иначе выбирается лучший ответ после удаления одного из последних символов. Нулевая строка и столбец равны нулю.</p><p>Для восстановления идите назад по допустимым переходам таблицы. При равенстве могут получиться разные верные ответы. Длинная общая подстрока не обязательно является LCS.</p><p><strong>Сложность:</strong> разрешены O((a+1)(b+1)) времени и памяти. <strong>Сдать:</strong> длину и одну оптимальную последовательность.</p>"
    },
    "lab": "lcs"
  },
  {
    "id": "merge",
    "title": {
      "EN": "Merging adjacent blocks",
      "RU": "Слияние соседних блоков"
    },
    "lead": {
      "EN": "Only neighbouring blocks can be merged.",
      "RU": "Объединять можно только соседние блоки."
    },
    "body": {
      "EN": "<p>A state <code>dp[l][r]</code> is the minimum cost of turning original blocks l…r into one block. Try the last split k. The cost is the two smaller answers plus the sum of sizes in l…r. Single blocks cost zero.</p><p>Compute shorter intervals first. Reconstruct both child plans before their parent merge. The output uses original indices, not changing positions in a shortened array.</p><p><strong>Cost:</strong> O(n³) time, O(n²) memory. Advanced optimizations are not required.</p>",
      "RU": "<p><code>dp[l][r]</code> — минимальная стоимость превращения исходных блоков l…r в один. Переберите последний split k. Стоимость — два меньших ответа плюс сумма размеров l…r. Один блок не требует слияния.</p><p>Сначала вычисляются короткие интервалы. При восстановлении планы детей выводятся раньше родительского слияния. Используются исходные индексы, а не текущие позиции сокращённого массива.</p><p><strong>Сложность:</strong> O(n³) времени, O(n²) памяти. Продвинутые оптимизации не нужны.</p>"
    },
    "lab": "merge"
  },
  {
    "id": "tree",
    "title": {
      "EN": "Independent set on a tree",
      "RU": "Независимое множество в дереве"
    },
    "lead": {
      "EN": "A chosen vertex excludes its neighbours.",
      "RU": "Выбор вершины исключает её соседей."
    },
    "body": {
      "EN": "<p>Root the tree for computation. <code>take[u]</code> includes u and skips every child. <code>skip[u]</code> excludes u and takes the better state of each child. Process children before their parent.</p><p>The empty set is allowed, so all-negative weights give zero. Reconstruction must respect the parent choice. Different roots and ties can change the selected set, but not the optimum weight.</p><p><strong>Cost:</strong> O(n) time and memory. Handle deep chains without call-stack failure.</p><p>Use exact integer totals. Each weight lies between −10⁹ and 10⁹; the sum is not restricted to the bound on one entry. Use signed 64-bit-safe arithmetic.</p>",
      "RU": "<p>Выберите корень для вычисления. <code>take[u]</code> включает u и пропускает каждого ребёнка. <code>skip[u]</code> исключает u и берёт лучшее состояние каждого ребёнка. Дети обрабатываются раньше родителя.</p><p>Пустой набор разрешён: все отрицательные веса дают ноль. Восстановление учитывает решение родителя. Корень и равные оптимумы могут изменить набор, но не оптимальный вес.</p><p><strong>Сложность:</strong> O(n) времени и памяти. Длинная цепочка не должна переполнять стек.</p><p>Суммы должны оставаться точными целыми. Каждый вес лежит от −10⁹ до 10⁹; сумма не ограничена границей одного веса. Используйте безопасную 64-битную арифметику.</p>"
    },
    "lab": "tree"
  },
  {
    "id": "naive",
    "title": {
      "EN": "Naive string search",
      "RU": "Наивный поиск"
    },
    "lead": {
      "EN": "A simple baseline makes stronger implementations easier to check.",
      "RU": "Простой базовый алгоритм помогает проверить более сложные реализации."
    },
    "body": {
      "EN": "<p>At every valid start, compare pattern characters. Report all starts in increasing order, including overlaps. A pattern longer than the text has no match. The empty pattern matches every boundary, including the final one.</p><p><strong>Cost:</strong> O(nm+n+1). The three search commands must return identical results on their common input domain.</p>",
      "RU": "<p>В каждом допустимом начале сравните символы шаблона. Верните все старты по возрастанию, включая перекрытия. Шаблон длиннее текста не совпадает. Пустой шаблон совпадает на каждой границе, включая последнюю.</p><p><strong>Сложность:</strong> O(nm+n+1). Три поисковые команды должны давать одинаковые результаты на общей области входов.</p>"
    },
    "lab": "naive"
  },
  {
    "id": "kmp",
    "title": {
      "EN": "Knuth–Morris–Pratt algorithm",
      "RU": "Алгоритм Кнута–Морриса–Пратта"
    },
    "lead": {
      "EN": "Use the prefix function to continue the search after a mismatch.",
      "RU": "Префикс-функция позволяет продолжить поиск после несовпадения."
    },
    "body": {
      "EN": "<p><code>pi[i]</code> is the length of the longest proper prefix of pattern[0…i] that is also its suffix. On mismatch, j falls back to pi[j−1]. The text index does not move backwards.</p><p>After a full match use the same prefix fallback to preserve overlaps. Handle the empty pattern before indexing it.</p><p><strong>Cost:</strong> O(n+m+answers+1) time; O(m+1) auxiliary and O(answers+1) output memory.</p>",
      "RU": "<p><code>pi[i]</code> — длина наибольшего собственного префикса pattern[0…i], совпадающего с суффиксом. При несовпадении j переходит к pi[j−1]. Индекс текста не возвращается назад.</p><p>После полного совпадения prefix fallback сохраняет перекрытия. Пустой шаблон обработайте до обращения к его символам.</p><p><strong>Сложность:</strong> O(n+m+ответы) времени и O(m+ответы) памяти.</p>"
    },
    "lab": "kmp"
  },
  {
    "id": "rk",
    "title": {
      "EN": "Rabin–Karp algorithm",
      "RU": "Алгоритм Рабина–Карпа"
    },
    "lead": {
      "EN": "Equal hashes still need a character comparison.",
      "RU": "Равные хеши требуют проверки символов."
    },
    "body": {
      "EN": "<p>Use ASCII codes, base 31 and modulus 101; the leftmost character has the highest power. Update the rolling hash when the window moves. Normalize a negative remainder.</p><p>This deliberately small modulus makes collisions visible. Compare actual characters before reporting every equal-hash window. Timing this laboratory configuration does not describe every production hashing implementation.</p><p><strong>Cost:</strong> O(n+m+c·m), where c is the number of candidate windows; worst case O(nm).</p><p>The candidate-window bound assumes 1≤m≤n. Handle m=0 and m&gt;n before forming a window. A bound covering every permitted input is O(nm+n+m+1), including the n+1 empty-pattern starts.</p>",
      "RU": "<p>Используйте ASCII-коды, base 31 и modulus 101; у левого символа наибольшая степень. При сдвиге окна обновляйте хеш. Нормализуйте отрицательный остаток.</p><p>Малый модуль специально делает коллизии видимыми. Перед выводом позиции сравните символы каждого окна-кандидата. Замеры этой учебной конфигурации не описывают все production-реализации хеширования.</p><p><strong>Сложность:</strong> O(n+m+c·m), c — число кандидатов; худший случай O(nm).</p><p>Оценка через окна-кандидаты предполагает 1≤m≤n. До построения окна обработайте m=0 и m&gt;n. Для всех допустимых входов подходит O(nm+n+m+1), включая n+1 позиций пустого шаблона.</p>"
    },
    "lab": "rk"
  },
  {
    "id": "suffix",
    "title": {
      "EN": "Suffix array and LCP",
      "RU": "Суффиксный массив и LCP"
    },
    "lead": {
      "EN": "The longest repeat appears as a common prefix of neighbouring suffixes.",
      "RU": "Самый длинный повтор встречается среди общих префиксов соседних суффиксов."
    },
    "body": {
      "EN": "<p>Prefix doubling sorts suffixes by pairs of ranks, then doubles the compared length. With comparison sorting it takes O(n log²n); radix/counting sorting per round permits O(n log n).</p><p>Kasai builds LCP in O(n) by reusing a common-prefix length, reducing it by at most one between text positions. Here lcp[0]=0 and lcp[i] compares sa[i−1] with sa[i]. Return any repeat of maximum LCP length; distinct starts may overlap.</p><p>Output only the nonempty suffixes of the original text. An internally added sentinel must not appear in sa. Auxiliary memory O(n).</p>",
      "RU": "<p>Prefix doubling сортирует суффиксы по парам рангов и удваивает сравниваемую длину. Comparison sort даёт O(n log²n); radix/counting sort на каждом раунде позволяет O(n log n).</p><p>Kasai строит LCP за O(n), повторно используя длину общего префикса и уменьшая её между позициями текста не более чем на один. Здесь lcp[0]=0, а lcp[i] сравнивает sa[i−1] и sa[i]. Верните любой повтор максимальной длины LCP; разные начала могут перекрываться.</p><p>В ответе только непустые суффиксы исходного текста. Внутренний sentinel не выводится в sa. Вспомогательная память O(n).</p>"
    },
    "lab": "suffix"
  },
  {
    "id": "aho",
    "title": {
      "EN": "Aho–Corasick algorithm",
      "RU": "Алгоритм Ахо–Корасик"
    },
    "lead": {
      "EN": "One automaton, overlapping matches, fresh counts for every text.",
      "RU": "Один автомат, перекрытия и новые счётчики для каждого текста."
    },
    "body": {
      "EN": "<p>Trie states represent dictionary prefixes. A failure link points to the longest proper suffix that is also a trie prefix. Reaching a state can match both its own terminal pattern and suffix patterns.</p><p>Count using output links or propagate state visits along failure links in reverse BFS order. Duplicate dictionary entries retain their separate output columns. Reset the state and counts for each independent text.</p><p>With fixed ASCII alphabet, build O(L+95S+p), where L is total pattern length including duplicates, S includes the root and p is dictionary size. Auxiliary automaton memory is O(95S+p), excluding input and output. Counting per text can use O(|text|+S+p) propagation or O(|text|+matches+p) output traversal. Do not copy quadratically many inherited outputs.</p><p>A4 returns counts, not a list of individual occurrences. Share terminal states for duplicate patterns. On dense inputs, use reverse-failure visit propagation or equally efficient aggregation: literal per-match traversal can exceed the limit even with correct counts.</p>",
      "RU": "<p>Состояния trie — префиксы словаря. Failure link ведёт в самый длинный собственный суффикс, который тоже является префиксом trie. В состоянии могут заканчиваться и собственный шаблон, и шаблоны-суффиксы.</p><p>Подсчитывайте через output links либо распространяйте посещения по failure links в обратном BFS-порядке. Дубликаты словаря сохраняют отдельные столбцы ответа. Для каждого независимого текста сбрасывайте состояние и счётчики.</p><p>При фиксированном ASCII построение O(L+95S+p): L — суммарная длина шаблонов с дубликатами, S включает корень, p — размер словаря. Вспомогательная память автомата O(95S+p), без входа и выхода. На текст: O(|text|+S+p) с propagation или O(|text|+matches+p) с output traversal. Не копируйте квадратично много унаследованных выходов.</p><p>A4 возвращает количества, а не список отдельных вхождений. Повторы словаря разделяют терминальную вершину. На плотных совпадениях используйте распространение посещений по failure links в обратном BFS или столь же эффективную агрегацию: обход каждого совпадения может превысить лимит даже при верных количествах.</p>"
    },
    "lab": "aho"
  },
  {
    "id": "testing",
    "title": {
      "EN": "Testing and comparison",
      "RU": "Тестирование и сравнение"
    },
    "lead": {
      "EN": "Correctness first. Measurements explain behaviour.",
      "RU": "Сначала корректность. Измерения помогают объяснить поведение."
    },
    "body": {
      "EN": "<p>Use small independently solved inputs and tests aimed at a specific defect: substring instead of subsequence, illegal adjacency, missed overlaps, hash collision, sentinel leakage, suffix patterns and stale counts.</p><p>For the search comparison choose the same input pairs at three increasing sizes in the common domain (both lengths≤3000). Record generator/seed, runtime, hardware, commands, timing boundary and warm-up. Measure at least three runs and report medians; exclude compilation. Separate random and repetitive cases.</p><p>Record the inputs, expected and actual results, and measured timings in ANALYSIS.md.</p>",
      "RU": "<p>Используйте малые независимо решённые входы и тесты конкретных ошибок: подстрока вместо подпоследовательности, нарушение смежности, потеря перекрытий, коллизия, лишний sentinel, шаблон-суффикс и старые счётчики.</p><p>Для сравнения поиска нужны одинаковые пары трёх возрастающих размеров в общем диапазоне (обе длины≤3000). Запишите генератор/seed, runtime, оборудование, команды, границу замера и прогрев. Минимум три измерения и медиана; компиляция исключается. Random и repetitive cases рассмотрите отдельно.</p><p>Запишите в ANALYSIS.md входы, ожидаемые и фактические результаты, реальные замеры времени.</p>"
    },
    "lab": null
  },
  {
    "id": "defence",
    "title": {
      "EN": "Defence preparation",
      "RU": "Подготовка к защите"
    },
    "lead": {
      "EN": "15 questions, 25 minutes, one attempt.",
      "RU": "15 вопросов, 25 минут, одна попытка."
    },
    "body": {
      "EN": "<p>The English defence has 10 single-answer and 5 multiple-response questions. Each is worth 1 raw point; grade = raw/15 × 50. There are three pages of five questions with free navigation. Work independently without AI or external assistance.</p><p>The questions cover all six assignment parts: states and transitions, reconstruction, counterexamples, invariants, correctness and efficiency. Small examples test understanding of your implementation.</p><h2>Multiple-response credit</h2><p>With k correct options (2 or 3), each selected correct option earns 1/k and each selected wrong option deducts 1/(2k), with a floor of zero per question. Selecting all five earns 0.25 for k=2 or about 0.67 for k=3. Full credit requires every correct option and no wrong ones.</p><p><a href=\"practice.html\">Start the ungraded 15-question / 25-minute practice</a>. Answers and explanations are available after the practice attempt. <a href=\"materials/Practice_15_EN.md\" download>Download the learning paper</a>.</p><p><a href=\"https://lms.astanait.edu.kz/mod/quiz/view.php?id=95271\">Open Assignment 4 - Defence Quiz in Moodle</a>. Availability: 29 October 2026 through 8 November 2026, 23:59. Moodle is authoritative for access and approved extensions.</p>",
      "RU": "<p>Защита на английском: 10 вопросов с одним ответом и 5 с несколькими верными вариантами. Каждый вопрос даёт до 1 исходного балла; оценка = raw/15 × 50. Три страницы по пять вопросов, свободная навигация. Во время защиты работайте самостоятельно без ИИ и внешней помощи.</p><p>Вопросы охватывают все шесть частей: состояния и переходы, восстановление, контрпримеры, инварианты, корректность и эффективность. Небольшие примеры проверяют понимание вашей реализации.</p><h2>Частичный балл</h2><p>При k верных вариантах (2 или 3) каждая верная отметка даёт 1/k, неверная вычитает 1/(2k). Минимум за вопрос — ноль. Выбор всех пяти даёт 0,25 при k=2 или около 0,67 при k=3. Полный балл требует всех верных без неверных.</p><p><a href=\"practice.html\">Открыть тренировку: 15 вопросов / 25 минут</a>. После тренировки доступны ответы и объяснения. <a href=\"materials/Practice_15_EN.md\" download>Скачать учебный вариант</a>.</p><p><a href=\"https://lms.astanait.edu.kz/mod/quiz/view.php?id=95271\">Assignment 4 - Defence Quiz в Moodle</a>. Доступ: с 29 октября по 8 ноября 2026 включительно, до 23:59. Доступность и продления определяются в Moodle.</p>"
    },
    "lab": null
  },
  {
    "id": "submit",
    "title": {
      "EN": "Submit your work",
      "RU": "Сдача работы"
    },
    "lead": {
      "EN": "Submit the commit URL in Moodle by 8 November, 23:59.",
      "RU": "Сдайте ссылку на коммит в Moodle до 8 ноября, 23:59."
    },
    "body": {
      "EN": "<p><a href=\"https://github.com/RZhaniya/daa-assignment-4-archive/generate\">Use this template → Create a new repository</a>, then clone your copy.</p><ol><li>Choose a language in submission.json.</li><li>Commit your source, own tests and English ANALYSIS.md.</li><li>Run local checks and make sure Public checks pass for your commit.</li><li>Submit the exact commit URL in Moodle Online text. An Actions run URL is optional.</li><li>For a private repository, give the instructor access. Click Submit assignment and verify the status.</li></ol><p>In ANALYSIS.md, acknowledge sources and AI assistance, their contribution and your verification. Approved extensions are recorded in Moodle.</p><p><a href=\"https://lms.astanait.edu.kz/mod/assign/view.php?id=95272\">Submit Assignment 4 in Moodle</a>. Opens 29 October 2026; deadline and cutoff 8 November 2026, 23:59. Practical 50 + defence 50 = 100; A4 contributes 20% of the second attestation. Quiz 2 is separate.</p>",
      "RU": "<p><a href=\"https://github.com/RZhaniya/daa-assignment-4-archive/generate\">Use this template → Create a new repository</a>, затем клонируйте свою копию.</p><ol><li>Выберите язык в submission.json.</li><li>Добавьте исходники, собственные тесты и английский ANALYSIS.md в коммит.</li><li>Запустите локальные проверки и дождитесь успешного результата Public checks в GitHub Actions.</li><li>Сдайте ссылку точного коммита в Moodle Online text. Actions run URL — по желанию.</li><li>Для закрытого репозитория предоставьте доступ преподавателю. Нажмите Submit assignment и проверьте статус.</li></ol><p>В ANALYSIS.md укажите источники и ИИ, их вклад и свою проверку. Согласованные продления указаны в Moodle.</p><p><a href=\"https://lms.astanait.edu.kz/mod/assign/view.php?id=95272\">Сдать Assignment 4 в Moodle</a>. Начало 29 октября 2026; дедлайн и окончание приёма — 8 ноября 2026, 23:59. Практика 50 + защита 50 = 100; A4 даёт 20% второй аттестации. Quiz 2 оценивается отдельно.</p>"
    },
    "lab": null
  },
  {
    "id": "sources",
    "title": {
      "EN": "Course materials",
      "RU": "Материалы курса"
    },
    "lead": {
      "EN": "Syllabus weeks 8–10 and the corresponding course lectures.",
      "RU": "Недели 8–10 силлабуса и соответствующие лекции курса."
    },
    "body": {
      "EN": "<p>The course syllabus and lectures are the source of the required topics. Lecture 8 covers DP patterns; the Lecture 9 file covers KMP/hash; Lecture 10 covers suffix arrays/Kasai/Aho. Use the course-provided textbook access.</p><p>Two conventions matter: LCS prefix lengths compare a[i−1]/b[j−1], and the A4 suffix output excludes an added sentinel. RK uses deliberate collision examples and exact character verification. <a href=\"LECTURE_CLARIFICATIONS_EN_RU.md\">Read the algorithm notes</a>.</p>",
      "RU": "<p>Темы определены силлабусом и лекциями. Лекция 8 — DP patterns, файл лекции 9 — KMP/hash, лекция 10 — suffix array/Kasai/Aho. Учебники открывайте через предоставленный курсом доступ.</p><p>Два важных соглашения: при LCS по длинам префиксов сравниваются a[i−1]/b[j−1]; суффиксный ответ A4 не включает добавленный sentinel. RK использует учебные коллизии и точную проверку символов. <a href=\"LECTURE_CLARIFICATIONS_EN_RU.md\">Прочитайте пояснения к алгоритмам</a>.</p>"
    },
    "lab": null
  }
];
