import type { Process } from '../../types/aspice'

export const ACQ_PROCESSES: Process[] = [
  {
    id: 'ACQ.3',
    name: {
      en: 'Contract Agreement',
      ja: '契約合意',
    },
    group: 'ACQ',
    purpose: {
      en: 'The purpose of the Contract Agreement Process is to negotiate and approve a contract between the acquirer and the supplier.',
      ja: '契約合意プロセスの目的は、調達者とサプライヤーの間の契約を交渉し承認することである。',
    },
    outcomes: [
      {
        id: 'ACQ.3.1',
        description: {
          en: 'Supplier selection criteria are defined.',
          ja: 'サプライヤー選定基準が定義されている。',
        },
      },
      {
        id: 'ACQ.3.2',
        description: {
          en: 'A contract is negotiated and agreed between the acquirer and the supplier.',
          ja: '調達者とサプライヤーの間で契約が交渉・合意されている。',
        },
      },
      {
        id: 'ACQ.3.3',
        description: {
          en: 'The contract reflects the requirements and constraints for the supplier.',
          ja: '契約がサプライヤーへの要件と制約を反映している。',
        },
      },
    ],
    basePractices: [
      {
        id: 'ACQ.3.BP1',
        name: { en: 'Define supplier selection criteria', ja: 'サプライヤー選定基準を定義する' },
        description: {
          en: 'Define criteria to evaluate and select a supplier.',
          ja: 'サプライヤーを評価・選定するための基準を定義する。',
        },
        supportsOutcomes: ['ACQ.3.1'],
        outputs: [{ itemId: 'ACQ-08-01' }],
        inputs: [],
      },
      {
        id: 'ACQ.3.BP2',
        name: { en: 'Negotiate and agree contract', ja: '契約を交渉・合意する' },
        description: {
          en: 'Negotiate a contract with the selected supplier reflecting the requirements, acceptance criteria, and constraints.',
          ja: '要件、受入基準、制約を反映した契約を選定されたサプライヤーと交渉する。',
        },
        supportsOutcomes: ['ACQ.3.2', 'ACQ.3.3'],
        outputs: [{ itemId: 'ACQ-04-01' }],
        inputs: [{ itemId: 'ACQ-08-01' }, { itemId: '17-12' }],
      },
    ],
    outputItems: [
      {
        id: 'ACQ-08-01',
        name: { en: 'Supplier Selection Criteria', ja: 'サプライヤー選定基準' },
        characteristics: [
          { en: 'Evaluation criteria for suppliers', ja: 'サプライヤーの評価基準' },
        ],
      },
      {
        id: 'ACQ-04-01',
        name: { en: 'Contract', ja: '契約' },
        characteristics: [
          { en: 'Requirements and acceptance criteria', ja: '要件と受入基準' },
          { en: 'Constraints and obligations', ja: '制約と義務' },
        ],
      },
    ],
  },
  {
    id: 'ACQ.4',
    name: {
      en: 'Supplier Monitoring',
      ja: 'サプライヤー監視',
    },
    group: 'ACQ',
    purpose: {
      en: 'The purpose of the Supplier Monitoring Process is to track and assess the performance of the supplier against agreed requirements.',
      ja: 'サプライヤー監視プロセスの目的は、合意された要件に対するサプライヤーのパフォーマンスを追跡・評価することである。',
    },
    outcomes: [
      {
        id: 'ACQ.4.1',
        description: {
          en: 'Joint reviews with the supplier are performed according to a defined schedule.',
          ja: 'サプライヤーとのジョイントレビューが定義されたスケジュールに従って実施されている。',
        },
      },
      {
        id: 'ACQ.4.2',
        description: {
          en: 'The supplier performance is monitored against agreed requirements.',
          ja: 'サプライヤーのパフォーマンスが合意された要件に対して監視されている。',
        },
      },
      {
        id: 'ACQ.4.3',
        description: {
          en: 'Issues and risks identified during monitoring are managed.',
          ja: '監視中に識別された問題とリスクが管理されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'ACQ.4.BP1',
        name: { en: 'Monitor supplier activities', ja: 'サプライヤー活動を監視する' },
        description: {
          en: "Monitor the supplier's activities and deliverables against the agreed requirements and project plan.",
          ja: '合意された要件とプロジェクト計画に対してサプライヤーの活動と成果物を監視する。',
        },
        supportsOutcomes: ['ACQ.4.2'],
        outputs: [{ itemId: 'ACQ-13-01' }],
        inputs: [{ itemId: 'ACQ-04-01' }],
      },
      {
        id: 'ACQ.4.BP2',
        name: { en: 'Conduct joint reviews', ja: 'ジョイントレビューを実施する' },
        description: {
          en: 'Conduct joint reviews with the supplier to assess progress and identify issues.',
          ja: 'サプライヤーとジョイントレビューを実施して進捗を評価し、問題を識別する。',
        },
        supportsOutcomes: ['ACQ.4.1'],
        outputs: [{ itemId: 'ACQ-13-01' }],
        inputs: [],
      },
      {
        id: 'ACQ.4.BP3',
        name: { en: 'Manage issues and risks', ja: '問題とリスクを管理する' },
        description: {
          en: 'Manage issues and risks identified during supplier monitoring.',
          ja: 'サプライヤー監視中に識別された問題とリスクを管理する。',
        },
        supportsOutcomes: ['ACQ.4.3'],
        outputs: [{ itemId: 'ACQ-13-01' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'ACQ-13-01',
        name: { en: 'Supplier Monitoring Records', ja: 'サプライヤー監視記録' },
        characteristics: [
          { en: 'Supplier performance data', ja: 'サプライヤーパフォーマンスデータ' },
          { en: 'Issues and risk status', ja: '問題とリスク状況' },
        ],
      },
    ],
  },
  {
    id: 'ACQ.13',
    name: {
      en: 'Project Requirements',
      ja: 'プロジェクト要件',
    },
    group: 'ACQ',
    purpose: {
      en: 'The purpose of the Project Requirements Process is to collect and communicate the acquirer\'s requirements to the supplier.',
      ja: 'プロジェクト要件プロセスの目的は、調達者の要件を収集してサプライヤーに伝達することである。',
    },
    outcomes: [
      {
        id: 'ACQ.13.1',
        description: {
          en: 'The acquirer\'s project requirements are defined and documented.',
          ja: '調達者のプロジェクト要件が定義・文書化されている。',
        },
      },
      {
        id: 'ACQ.13.2',
        description: {
          en: 'Project requirements are communicated to the supplier.',
          ja: 'プロジェクト要件がサプライヤーに伝達されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'ACQ.13.BP1',
        name: { en: 'Define project requirements', ja: 'プロジェクト要件を定義する' },
        description: {
          en: 'Define and document the acquirer\'s project requirements including quality, schedule, and process requirements.',
          ja: '品質、スケジュール、プロセス要件を含む調達者のプロジェクト要件を定義・文書化する。',
        },
        supportsOutcomes: ['ACQ.13.1'],
        outputs: [{ itemId: 'ACQ-17-01' }],
        inputs: [{ itemId: '17-12' }],
      },
      {
        id: 'ACQ.13.BP2',
        name: { en: 'Communicate project requirements', ja: 'プロジェクト要件を伝達する' },
        description: {
          en: 'Communicate the project requirements to the supplier and agree on their implementation.',
          ja: 'プロジェクト要件をサプライヤーに伝達し、その実施について合意する。',
        },
        supportsOutcomes: ['ACQ.13.2'],
        outputs: [{ itemId: 'ACQ-17-01' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'ACQ-17-01',
        name: { en: 'Project Requirements', ja: 'プロジェクト要件' },
        characteristics: [
          { en: 'Quality and process requirements', ja: '品質とプロセス要件' },
          { en: 'Schedule requirements', ja: 'スケジュール要件' },
        ],
      },
    ],
  },
  {
    id: 'ACQ.14',
    name: {
      en: 'Technical Requirements',
      ja: '技術要件',
    },
    group: 'ACQ',
    purpose: {
      en: 'The purpose of the Technical Requirements Process is to communicate the technical requirements to the supplier.',
      ja: '技術要件プロセスの目的は、技術要件をサプライヤーに伝達することである。',
    },
    outcomes: [
      {
        id: 'ACQ.14.1',
        description: {
          en: 'Technical requirements are defined and documented.',
          ja: '技術要件が定義・文書化されている。',
        },
      },
      {
        id: 'ACQ.14.2',
        description: {
          en: 'Technical requirements are communicated to the supplier.',
          ja: '技術要件がサプライヤーに伝達されている。',
        },
      },
      {
        id: 'ACQ.14.3',
        description: {
          en: 'Changes to technical requirements are managed.',
          ja: '技術要件への変更が管理されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'ACQ.14.BP1',
        name: { en: 'Specify technical requirements', ja: '技術要件を規定する' },
        description: {
          en: 'Define and document the technical requirements to be fulfilled by the supplier.',
          ja: 'サプライヤーが満たすべき技術要件を定義・文書化する。',
        },
        supportsOutcomes: ['ACQ.14.1'],
        outputs: [{ itemId: 'ACQ-17-02' }],
        inputs: [{ itemId: '17-11' }, { itemId: '04-07' }],
      },
      {
        id: 'ACQ.14.BP2',
        name: { en: 'Communicate and manage technical requirements', ja: '技術要件を伝達・管理する' },
        description: {
          en: 'Communicate technical requirements to the supplier and manage changes to them.',
          ja: '技術要件をサプライヤーに伝達し、その変更を管理する。',
        },
        supportsOutcomes: ['ACQ.14.2', 'ACQ.14.3'],
        outputs: [{ itemId: 'ACQ-17-02' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'ACQ-17-02',
        name: { en: 'Technical Requirements (for supplier)', ja: '技術要件（サプライヤー向け）' },
        characteristics: [
          { en: 'Functional and non-functional requirements', ja: '機能的・非機能的要件' },
          { en: 'Interface and integration requirements', ja: 'インターフェースと統合要件' },
        ],
      },
    ],
  },
]

export const SPL_PROCESSES: Process[] = [
  {
    id: 'SPL.1',
    name: {
      en: 'Supplier Tendering',
      ja: 'サプライヤー入札',
    },
    group: 'SPL',
    purpose: {
      en: 'The purpose of the Supplier Tendering Process is to establish an interface to the acquirer to receive and evaluate acquisition requirements.',
      ja: 'サプライヤー入札プロセスの目的は、調達要件を受け取り評価するために調達者とのインターフェースを確立することである。',
    },
    outcomes: [
      {
        id: 'SPL.1.1',
        description: {
          en: 'The supplier understands the acquirer\'s requirements.',
          ja: 'サプライヤーが調達者の要件を理解している。',
        },
      },
      {
        id: 'SPL.1.2',
        description: {
          en: 'A proposal is prepared and submitted addressing the acquirer\'s requirements.',
          ja: '調達者の要件に対応した提案が作成・提出されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SPL.1.BP1',
        name: { en: 'Evaluate acquisition requirements', ja: '調達要件を評価する' },
        description: {
          en: 'Receive and evaluate the acquirer\'s requirements to understand the scope of work.',
          ja: '調達者の要件を受け取り評価して作業のスコープを理解する。',
        },
        supportsOutcomes: ['SPL.1.1'],
        outputs: [],
        inputs: [{ itemId: 'ACQ-17-01' }, { itemId: 'ACQ-17-02' }],
      },
      {
        id: 'SPL.1.BP2',
        name: { en: 'Prepare and submit proposal', ja: '提案を作成・提出する' },
        description: {
          en: 'Prepare a proposal addressing the acquirer\'s requirements and submit it.',
          ja: '調達者の要件に対応した提案を作成し提出する。',
        },
        supportsOutcomes: ['SPL.1.2'],
        outputs: [{ itemId: 'SPL-08-01' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'SPL-08-01',
        name: { en: 'Supplier Proposal', ja: 'サプライヤー提案' },
        characteristics: [
          { en: 'Technical and management approach', ja: '技術的・管理的アプローチ' },
          { en: 'Schedule and cost estimate', ja: 'スケジュールとコスト見積もり' },
        ],
      },
    ],
  },
  {
    id: 'SPL.2',
    name: {
      en: 'Product Release',
      ja: '製品リリース',
    },
    group: 'SPL',
    purpose: {
      en: 'The purpose of the Product Release Process is to control the release of a product to the acquirer.',
      ja: '製品リリースプロセスの目的は、調達者への製品のリリースを管理することである。',
    },
    outcomes: [
      {
        id: 'SPL.2.1',
        description: {
          en: 'A release strategy is defined.',
          ja: 'リリース戦略が定義されている。',
        },
      },
      {
        id: 'SPL.2.2',
        description: {
          en: 'The product to be released is ensured to fulfil the release requirements.',
          ja: 'リリースされる製品がリリース要件を満たすことが確保されている。',
        },
      },
      {
        id: 'SPL.2.3',
        description: {
          en: 'The released product and its documentation are available to the acquirer.',
          ja: 'リリースされた製品とその文書が調達者に利用可能である。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SPL.2.BP1',
        name: { en: 'Define release strategy', ja: 'リリース戦略を定義する' },
        description: {
          en: 'Define the release strategy including release criteria, content, and schedule.',
          ja: 'リリース基準、内容、スケジュールを含むリリース戦略を定義する。',
        },
        supportsOutcomes: ['SPL.2.1'],
        outputs: [{ itemId: 'SPL-08-02' }],
        inputs: [{ itemId: 'ACQ-04-01' }],
      },
      {
        id: 'SPL.2.BP2',
        name: { en: 'Release the product', ja: '製品をリリースする' },
        description: {
          en: 'Ensure the product meets release criteria and make the product and documentation available to the acquirer.',
          ja: '製品がリリース基準を満たすことを確保し、製品と文書を調達者に利用可能にする。',
        },
        supportsOutcomes: ['SPL.2.2', 'SPL.2.3'],
        outputs: [{ itemId: 'SPL-13-01' }],
        inputs: [{ itemId: 'SPL-08-02' }],
      },
    ],
    outputItems: [
      {
        id: 'SPL-08-02',
        name: { en: 'Release Plan', ja: 'リリース計画' },
        characteristics: [
          { en: 'Release criteria and content', ja: 'リリース基準と内容' },
          { en: 'Release schedule', ja: 'リリーススケジュール' },
        ],
      },
      {
        id: 'SPL-13-01',
        name: { en: 'Release Record', ja: 'リリース記録' },
        characteristics: [
          { en: 'Released product and version', ja: 'リリースされた製品とバージョン' },
          { en: 'Release notes and documentation', ja: 'リリースノートと文書' },
        ],
      },
    ],
  },
]

export const REU_PROCESSES: Process[] = [
  {
    id: 'REU.2',
    name: {
      en: 'Reuse Program Management',
      ja: '再利用プログラム管理',
    },
    group: 'REU',
    purpose: {
      en: 'The purpose of the Reuse Program Management Process is to plan, establish, manage, control, and monitor an organisation\'s reuse program and to systematically exploit existing software assets.',
      ja: '再利用プログラム管理プロセスの目的は、組織の再利用プログラムを計画、確立、管理、監視し、既存のソフトウェア資産を体系的に活用することである。',
    },
    outcomes: [
      {
        id: 'REU.2.1',
        description: {
          en: 'A reuse strategy is defined and maintained.',
          ja: '再利用戦略が定義・維持されている。',
        },
      },
      {
        id: 'REU.2.2',
        description: {
          en: 'Reusable assets are identified, assessed, and made available.',
          ja: '再利用可能な資産が識別、評価され、利用可能となっている。',
        },
      },
      {
        id: 'REU.2.3',
        description: {
          en: 'The use of reusable assets is monitored and measured.',
          ja: '再利用可能な資産の使用が監視・計測されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'REU.2.BP1',
        name: { en: 'Define reuse strategy', ja: '再利用戦略を定義する' },
        description: {
          en: 'Define and maintain an organisational reuse strategy identifying reuse goals and approach.',
          ja: '再利用目標とアプローチを識別する組織的再利用戦略を定義・維持する。',
        },
        supportsOutcomes: ['REU.2.1'],
        outputs: [{ itemId: 'REU-08-01' }],
        inputs: [],
      },
      {
        id: 'REU.2.BP2',
        name: { en: 'Manage reusable assets', ja: '再利用可能な資産を管理する' },
        description: {
          en: 'Identify, evaluate, and catalogue reusable assets and make them available for reuse in projects.',
          ja: '再利用可能な資産を識別、評価、カタログ化し、プロジェクトでの再利用のために利用可能にする。',
        },
        supportsOutcomes: ['REU.2.2'],
        outputs: [{ itemId: 'REU-13-01' }],
        inputs: [{ itemId: 'REU-08-01' }],
      },
      {
        id: 'REU.2.BP3',
        name: { en: 'Monitor reuse', ja: '再利用を監視する' },
        description: {
          en: 'Monitor and measure the use of reusable assets across projects.',
          ja: 'プロジェクト全体にわたって再利用可能な資産の使用を監視・計測する。',
        },
        supportsOutcomes: ['REU.2.3'],
        outputs: [{ itemId: 'REU-13-01' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'REU-08-01',
        name: { en: 'Reuse Strategy', ja: '再利用戦略' },
        characteristics: [
          { en: 'Reuse goals and scope', ja: '再利用目標とスコープ' },
          { en: 'Asset identification criteria', ja: '資産識別基準' },
        ],
      },
      {
        id: 'REU-13-01',
        name: { en: 'Reuse Records', ja: '再利用記録' },
        characteristics: [
          { en: 'Reusable asset catalogue', ja: '再利用可能な資産カタログ' },
          { en: 'Reuse metrics', ja: '再利用メトリクス' },
        ],
      },
    ],
  },
]
