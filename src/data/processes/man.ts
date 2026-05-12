import type { Process } from '../../types/aspice'

export const MAN_PROCESSES: Process[] = [
  {
    id: 'MAN.3',
    name: {
      en: 'Project Management',
      ja: 'プロジェクト管理',
    },
    group: 'MAN',
    purpose: {
      en: 'The purpose of the Project Management Process is to identify, establish, and control the activities and resources necessary for a project to produce a product and/or service, in the context of the project requirements and constraints.',
      ja: 'プロジェクト管理プロセスの目的は、プロジェクトの要件と制約の文脈において、製品および/またはサービスを生産するためにプロジェクトに必要な活動とリソースを識別、確立、管理することである。',
    },
    outcomes: [
      {
        id: 'MAN.3.1',
        description: {
          en: 'The scope of the work to be performed is defined.',
          ja: '実施すべき作業のスコープが定義されている。',
        },
      },
      {
        id: 'MAN.3.2',
        description: {
          en: 'Feasibility of achieving goals of the project with available resources and within constraints is evaluated.',
          ja: '利用可能なリソースで制約の範囲内においてプロジェクトの目標を達成することの実現可能性が評価されている。',
        },
      },
      {
        id: 'MAN.3.3',
        description: {
          en: 'Activities, resources and responsibilities for the project are identified and estimated.',
          ja: 'プロジェクトの活動、リソース、責任が識別され、見積もられている。',
        },
      },
      {
        id: 'MAN.3.4',
        description: {
          en: 'Interfaces within the project and with other projects and organizational units are identified and monitored.',
          ja: 'プロジェクト内および他のプロジェクトや組織単位とのインターフェースが識別され、監視されている。',
        },
      },
      {
        id: 'MAN.3.5',
        description: {
          en: 'Execution of the project is planned and scheduled according to defined criteria.',
          ja: '定義された基準に従ってプロジェクトの実行が計画され、スケジュールされている。',
        },
      },
      {
        id: 'MAN.3.6',
        description: {
          en: 'Progress of the project is monitored against the plan and corrective action is taken when planned results are not achieved.',
          ja: '計画に対するプロジェクトの進捗が監視され、計画された結果が達成されない場合は是正処置が講じられる。',
        },
      },
    ],
    basePractices: [
      {
        id: 'MAN.3.BP1',
        name: { en: 'Define the scope of work', ja: '作業のスコープを定義する' },
        description: {
          en: 'Identify the project goals, motivation and boundaries. Agree on the scope of work with the relevant stakeholders.',
          ja: 'プロジェクトの目標、動機、境界を識別する。関連するステークホルダーと作業のスコープに合意する。',
        },
        supportsOutcomes: ['MAN.3.1'],
        outputs: [{ itemId: 'MAN-08-01' }],
        inputs: [{ itemId: '17-12' }],
      },
      {
        id: 'MAN.3.BP2',
        name: { en: 'Define project lifecycle', ja: 'プロジェクトライフサイクルを定義する' },
        description: {
          en: 'Define the project lifecycle model appropriate for the project scope, context and complexity.',
          ja: 'プロジェクトのスコープ、コンテキスト、複雑さに適したプロジェクトライフサイクルモデルを定義する。',
        },
        supportsOutcomes: ['MAN.3.2'],
        outputs: [{ itemId: 'MAN-08-01' }],
        inputs: [],
      },
      {
        id: 'MAN.3.BP3',
        name: { en: 'Evaluate feasibility', ja: '実現可能性を評価する' },
        description: {
          en: 'Evaluate the feasibility of achieving the project goals with available resources and within constraints.',
          ja: '利用可能なリソースで制約の範囲内においてプロジェクトの目標を達成する実現可能性を評価する。',
        },
        supportsOutcomes: ['MAN.3.2'],
        outputs: [{ itemId: 'MAN-08-01' }],
        inputs: [],
      },
      {
        id: 'MAN.3.BP4',
        name: { en: 'Define activities, resources and schedule', ja: '活動、リソース、スケジュールを定義する' },
        description: {
          en: 'Define all activities to be performed, estimate effort and resources, and develop the project schedule.',
          ja: '実施すべきすべての活動を定義し、工数とリソースを見積もり、プロジェクトスケジュールを策定する。',
        },
        supportsOutcomes: ['MAN.3.3', 'MAN.3.5'],
        outputs: [{ itemId: 'MAN-08-01' }],
        inputs: [],
      },
      {
        id: 'MAN.3.BP5',
        name: { en: 'Monitor project', ja: 'プロジェクトを監視する' },
        description: {
          en: 'Monitor the project execution against the plan. Identify deviations and take corrective action when needed.',
          ja: '計画に対するプロジェクト実行を監視する。逸脱を識別し、必要に応じて是正処置を講じる。',
        },
        supportsOutcomes: ['MAN.3.6'],
        outputs: [{ itemId: 'MAN-13-01' }],
        inputs: [{ itemId: 'MAN-08-01' }],
      },
    ],
    outputItems: [
      {
        id: 'MAN-08-01',
        name: { en: 'Project Plan', ja: 'プロジェクト計画' },
        characteristics: [
          { en: 'Scope, objectives, and constraints', ja: 'スコープ、目標、制約' },
          { en: 'Activities, resources, and schedule', ja: '活動、リソース、スケジュール' },
          { en: 'Lifecycle model', ja: 'ライフサイクルモデル' },
        ],
      },
      {
        id: 'MAN-13-01',
        name: { en: 'Project Status Record', ja: 'プロジェクト状況記録' },
        characteristics: [
          { en: 'Progress against plan', ja: '計画に対する進捗' },
          { en: 'Corrective actions taken', ja: '講じた是正処置' },
        ],
      },
    ],
  },
  {
    id: 'MAN.5',
    name: {
      en: 'Risk Management',
      ja: 'リスク管理',
    },
    group: 'MAN',
    purpose: {
      en: 'The purpose of the Risk Management Process is to identify, analyse, treat and monitor the risks continuously.',
      ja: 'リスク管理プロセスの目的は、リスクを継続的に識別、分析、対処、監視することである。',
    },
    outcomes: [
      {
        id: 'MAN.5.1',
        description: {
          en: 'The scope of the risk management to be performed is determined.',
          ja: '実施すべきリスク管理のスコープが決定されている。',
        },
      },
      {
        id: 'MAN.5.2',
        description: {
          en: 'Appropriate risk management strategies are defined and implemented.',
          ja: '適切なリスク管理戦略が定義され、実施されている。',
        },
      },
      {
        id: 'MAN.5.3',
        description: {
          en: 'Risks are identified and analysed to determine their importance.',
          ja: 'リスクが識別・分析されて重要性が判断されている。',
        },
      },
      {
        id: 'MAN.5.4',
        description: {
          en: 'Risk treatment options are determined and mitigation actions are implemented.',
          ja: 'リスク対処オプションが決定され、軽減処置が実施されている。',
        },
      },
      {
        id: 'MAN.5.5',
        description: {
          en: 'Risks are monitored and actions are taken to correct deviations from the risk management plan.',
          ja: 'リスクが監視され、リスク管理計画からの逸脱を是正するための処置が講じられる。',
        },
      },
    ],
    basePractices: [
      {
        id: 'MAN.5.BP1',
        name: { en: 'Establish risk management scope', ja: 'リスク管理スコープを確立する' },
        description: {
          en: 'Determine the scope of risk management and define the risk management strategy including thresholds and risk parameters.',
          ja: 'リスク管理のスコープを決定し、閾値とリスクパラメータを含むリスク管理戦略を定義する。',
        },
        supportsOutcomes: ['MAN.5.1', 'MAN.5.2'],
        outputs: [{ itemId: 'MAN-08-02' }],
        inputs: [{ itemId: 'MAN-08-01' }],
      },
      {
        id: 'MAN.5.BP2',
        name: { en: 'Identify and analyse risks', ja: 'リスクを識別・分析する' },
        description: {
          en: 'Identify and analyse risks to determine their probability, impact and importance.',
          ja: 'リスクを識別・分析して確率、影響、重要性を判断する。',
        },
        supportsOutcomes: ['MAN.5.3'],
        outputs: [{ itemId: 'MAN-08-02' }],
        inputs: [],
      },
      {
        id: 'MAN.5.BP3',
        name: { en: 'Define and implement risk treatment actions', ja: 'リスク対処処置を定義・実施する' },
        description: {
          en: 'Determine risk treatment options and implement appropriate mitigation actions for all identified risks.',
          ja: 'すべての識別されたリスクに対してリスク対処オプションを決定し、適切な軽減処置を実施する。',
        },
        supportsOutcomes: ['MAN.5.4'],
        outputs: [{ itemId: 'MAN-08-02' }],
        inputs: [],
      },
      {
        id: 'MAN.5.BP4',
        name: { en: 'Monitor risks', ja: 'リスクを監視する' },
        description: {
          en: 'Monitor risks and risk mitigation actions throughout the project lifecycle.',
          ja: 'プロジェクトライフサイクルを通じてリスクとリスク軽減処置を監視する。',
        },
        supportsOutcomes: ['MAN.5.5'],
        outputs: [{ itemId: 'MAN-08-02' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'MAN-08-02',
        name: { en: 'Risk Management Plan / Risk Register', ja: 'リスク管理計画 / リスク登録簿' },
        characteristics: [
          { en: 'Identified risks with probability and impact', ja: '確率と影響を伴う識別されたリスク' },
          { en: 'Risk mitigation actions', ja: 'リスク軽減処置' },
          { en: 'Risk status', ja: 'リスク状況' },
        ],
      },
    ],
  },
  {
    id: 'MAN.6',
    name: {
      en: 'Measurement',
      ja: '計測',
    },
    group: 'MAN',
    purpose: {
      en: 'The purpose of the Measurement Process is to collect and analyse data relating to the products developed and processes implemented within the organizational unit to support effective management of the processes and to objectively demonstrate the quality of the products.',
      ja: '計測プロセスの目的は、プロセスの効果的な管理を支援し、製品の品質を客観的に実証するために、組織単位内で開発された製品および実施されたプロセスに関するデータを収集・分析することである。',
    },
    outcomes: [
      {
        id: 'MAN.6.1',
        description: {
          en: 'Measurement objectives are identified and prioritised to support the management information needs.',
          ja: '計測目標が識別・優先順位付けされ、マネジメント情報ニーズを支援している。',
        },
      },
      {
        id: 'MAN.6.2',
        description: {
          en: 'A set of measures are identified and defined to address the measurement objectives.',
          ja: '計測目標に対処するための計測指標の集合が識別・定義されている。',
        },
      },
      {
        id: 'MAN.6.3',
        description: {
          en: 'Required data is collected, stored, and analysed to provide measurement results.',
          ja: '必要なデータが収集・保存・分析され、計測結果が提供されている。',
        },
      },
      {
        id: 'MAN.6.4',
        description: {
          en: 'Measurement results are communicated to stakeholders to support decision-making.',
          ja: '意思決定を支援するために計測結果がステークホルダーに伝達されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'MAN.6.BP1',
        name: { en: 'Establish measurement objectives', ja: '計測目標を確立する' },
        description: {
          en: 'Identify the measurement objectives that address management information needs.',
          ja: 'マネジメント情報ニーズに対応する計測目標を識別する。',
        },
        supportsOutcomes: ['MAN.6.1'],
        outputs: [{ itemId: 'MAN-08-03' }],
        inputs: [{ itemId: 'MAN-08-01' }],
      },
      {
        id: 'MAN.6.BP2',
        name: { en: 'Define measures', ja: '計測指標を定義する' },
        description: {
          en: 'Identify and define a set of measures to address the measurement objectives.',
          ja: '計測目標に対処するための計測指標の集合を識別・定義する。',
        },
        supportsOutcomes: ['MAN.6.2'],
        outputs: [{ itemId: 'MAN-08-03' }],
        inputs: [],
      },
      {
        id: 'MAN.6.BP3',
        name: { en: 'Collect and analyse data', ja: 'データを収集・分析する' },
        description: {
          en: 'Collect data for the defined measures, store and analyse the data to provide measurement results.',
          ja: '定義された計測指標のデータを収集し、データを保存・分析して計測結果を提供する。',
        },
        supportsOutcomes: ['MAN.6.3'],
        outputs: [{ itemId: 'MAN-13-02' }],
        inputs: [{ itemId: 'MAN-08-03' }],
      },
      {
        id: 'MAN.6.BP4',
        name: { en: 'Communicate measurement results', ja: '計測結果を伝達する' },
        description: {
          en: 'Communicate measurement results to stakeholders to support decision-making and corrective action.',
          ja: '意思決定と是正処置を支援するために計測結果をステークホルダーに伝達する。',
        },
        supportsOutcomes: ['MAN.6.4'],
        outputs: [{ itemId: 'MAN-13-02' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'MAN-08-03',
        name: { en: 'Measurement Plan', ja: '計測計画' },
        characteristics: [
          { en: 'Measurement objectives', ja: '計測目標' },
          { en: 'Defined measures and data collection procedures', ja: '定義された計測指標とデータ収集手順' },
        ],
      },
      {
        id: 'MAN-13-02',
        name: { en: 'Measurement Results', ja: '計測結果' },
        characteristics: [
          { en: 'Collected and analysed data', ja: '収集・分析されたデータ' },
          { en: 'Analysis results and trends', ja: '分析結果とトレンド' },
        ],
      },
    ],
  },
]
