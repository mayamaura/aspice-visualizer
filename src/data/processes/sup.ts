import type { Process } from '../../types/aspice'

export const SUP_PROCESSES: Process[] = [
  {
    id: 'SUP.1',
    name: {
      en: 'Quality Assurance',
      ja: '品質保証',
    },
    group: 'SUP',
    purpose: {
      en: 'The purpose of the Quality Assurance Process is to provide independent and objective assurance that work products and processes comply with defined requirements and plans, and that non-conformances are resolved.',
      ja: '品質保証プロセスの目的は、成果物とプロセスが定義された要件と計画に準拠していること、および不適合が解決されていることの独立した客観的な保証を提供することである。',
    },
    outcomes: [
      {
        id: 'SUP.1.1',
        description: {
          en: 'A quality assurance strategy is developed to ensure compliance of work products and processes with applicable requirements.',
          ja: '成果物とプロセスが適用可能な要件に準拠していることを確保するための品質保証戦略が開発されている。',
        },
      },
      {
        id: 'SUP.1.2',
        description: {
          en: 'Adherence of work products to applicable standards and requirements is verified.',
          ja: '成果物が該当する標準と要件に準拠していることが検証されている。',
        },
      },
      {
        id: 'SUP.1.3',
        description: {
          en: 'Adherence of the implemented processes to applicable process standards and requirements is verified.',
          ja: '実施されたプロセスが該当するプロセス標準と要件に準拠していることが検証されている。',
        },
      },
      {
        id: 'SUP.1.4',
        description: {
          en: 'Non-conformances are communicated and tracked to closure.',
          ja: '不適合が伝達されクローズまで追跡されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SUP.1.BP1',
        name: { en: 'Develop quality assurance strategy', ja: '品質保証戦略を開発する' },
        description: {
          en: 'Develop a strategy including scope, methods, responsibilities and schedule for quality assurance activities.',
          ja: '品質保証活動のスコープ、方法、責任、スケジュールを含む戦略を開発する。',
        },
        supportsOutcomes: ['SUP.1.1'],
        outputs: [{ itemId: 'SUP-08-01' }],
        inputs: [{ itemId: 'MAN-08-01' }],
      },
      {
        id: 'SUP.1.BP2',
        name: { en: 'Assure quality of work products', ja: '成果物の品質を保証する' },
        description: {
          en: 'Verify the compliance of work products with applicable standards and requirements according to the quality assurance strategy.',
          ja: '品質保証戦略に従って、成果物が該当する標準と要件に準拠していることを検証する。',
        },
        supportsOutcomes: ['SUP.1.2'],
        outputs: [{ itemId: 'SUP-13-01' }],
        inputs: [{ itemId: 'SUP-08-01' }],
      },
      {
        id: 'SUP.1.BP3',
        name: { en: 'Assure quality of process implementation', ja: 'プロセス実施の品質を保証する' },
        description: {
          en: 'Verify the compliance of the implemented processes with applicable process standards and requirements.',
          ja: '実施されたプロセスが該当するプロセス標準と要件に準拠していることを検証する。',
        },
        supportsOutcomes: ['SUP.1.3'],
        outputs: [{ itemId: 'SUP-13-01' }],
        inputs: [],
      },
      {
        id: 'SUP.1.BP4',
        name: { en: 'Manage non-conformances', ja: '不適合を管理する' },
        description: {
          en: 'Communicate non-conformances to the affected parties and track them to closure.',
          ja: '不適合を影響を受ける関係者に伝達し、クローズまで追跡する。',
        },
        supportsOutcomes: ['SUP.1.4'],
        outputs: [{ itemId: 'SUP-13-01' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'SUP-08-01',
        name: { en: 'Quality Assurance Plan', ja: '品質保証計画' },
        characteristics: [
          { en: 'QA scope and methods', ja: 'QAスコープと方法' },
          { en: 'QA schedule and responsibilities', ja: 'QAスケジュールと責任' },
        ],
      },
      {
        id: 'SUP-13-01',
        name: { en: 'QA Records', ja: 'QA記録' },
        characteristics: [
          { en: 'Non-conformance records', ja: '不適合記録' },
          { en: 'Corrective actions and closure status', ja: '是正処置とクローズ状況' },
        ],
      },
    ],
  },
  {
    id: 'SUP.2',
    name: {
      en: 'Verification',
      ja: '検証',
    },
    group: 'SUP',
    purpose: {
      en: 'The purpose of the Verification Process is to confirm that each work product of a process or project properly reflects the specified requirements.',
      ja: '検証プロセスの目的は、プロセスまたはプロジェクトの各成果物が規定された要件を適切に反映していることを確認することである。',
    },
    outcomes: [
      {
        id: 'SUP.2.1',
        description: {
          en: 'A verification strategy is developed, including the methods and criteria for verification.',
          ja: '検証方法と基準を含む検証戦略が開発されている。',
        },
      },
      {
        id: 'SUP.2.2',
        description: {
          en: 'Verification criteria are defined for work products to be verified.',
          ja: '検証される成果物の検証基準が定義されている。',
        },
      },
      {
        id: 'SUP.2.3',
        description: {
          en: 'Required verification activities are performed.',
          ja: '必要な検証活動が実施されている。',
        },
      },
      {
        id: 'SUP.2.4',
        description: {
          en: 'Defects found are identified and corrective actions are initiated.',
          ja: '発見された欠陥が識別され、是正処置が開始されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SUP.2.BP1',
        name: { en: 'Develop verification strategy', ja: '検証戦略を開発する' },
        description: {
          en: 'Develop a verification strategy identifying the work products to be verified, verification methods, and schedule.',
          ja: '検証される成果物、検証方法、スケジュールを識別する検証戦略を開発する。',
        },
        supportsOutcomes: ['SUP.2.1'],
        outputs: [{ itemId: 'SUP-08-02' }],
        inputs: [{ itemId: 'MAN-08-01' }],
      },
      {
        id: 'SUP.2.BP2',
        name: { en: 'Perform verification', ja: '検証を実施する' },
        description: {
          en: 'Perform verification activities according to the verification strategy and defined criteria.',
          ja: '検証戦略と定義された基準に従って検証活動を実施する。',
        },
        supportsOutcomes: ['SUP.2.2', 'SUP.2.3'],
        outputs: [{ itemId: 'SUP-13-02' }],
        inputs: [{ itemId: 'SUP-08-02' }],
      },
      {
        id: 'SUP.2.BP3',
        name: { en: 'Manage defects', ja: '欠陥を管理する' },
        description: {
          en: 'Identify and track defects found during verification and initiate corrective actions.',
          ja: '検証中に発見された欠陥を識別・追跡し、是正処置を開始する。',
        },
        supportsOutcomes: ['SUP.2.4'],
        outputs: [{ itemId: 'SUP-13-02' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'SUP-08-02',
        name: { en: 'Verification Plan', ja: '検証計画' },
        characteristics: [
          { en: 'Work products to be verified', ja: '検証される成果物' },
          { en: 'Verification methods and criteria', ja: '検証方法と基準' },
        ],
      },
      {
        id: 'SUP-13-02',
        name: { en: 'Verification Results', ja: '検証結果' },
        characteristics: [
          { en: 'Verification evidence', ja: '検証証拠' },
          { en: 'Defects and corrective actions', ja: '欠陥と是正処置' },
        ],
      },
    ],
  },
  {
    id: 'SUP.4',
    name: {
      en: 'Joint Review',
      ja: 'ジョイントレビュー',
    },
    group: 'SUP',
    purpose: {
      en: 'The purpose of the Joint Review Process is to maintain a common understanding with the stakeholders of the progress against the objectives and what should be done to help ensure development of a product that satisfies the stakeholders.',
      ja: 'ジョイントレビュープロセスの目的は、目標に対する進捗について、ステークホルダーとの共通理解を維持し、ステークホルダーを満足させる製品の開発を支援するために何をすべきかを明確にすることである。',
    },
    outcomes: [
      {
        id: 'SUP.4.1',
        description: {
          en: 'Reviews are performed at milestones defined in project agreements.',
          ja: 'プロジェクト合意事項で定義されたマイルストーンでレビューが実施されている。',
        },
      },
      {
        id: 'SUP.4.2',
        description: {
          en: 'The status and products of project activities are assessed against the project agreements.',
          ja: 'プロジェクト活動の状況と成果物がプロジェクト合意事項に対して評価されている。',
        },
      },
      {
        id: 'SUP.4.3',
        description: {
          en: 'Action items resulting from reviews are managed.',
          ja: 'レビューから生じたアクションアイテムが管理されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SUP.4.BP1',
        name: { en: 'Plan joint reviews', ja: 'ジョイントレビューを計画する' },
        description: {
          en: 'Agree with relevant stakeholders on the schedule, participants, objectives, and agenda for joint reviews.',
          ja: 'ジョイントレビューのスケジュール、参加者、目標、議題について関連するステークホルダーと合意する。',
        },
        supportsOutcomes: ['SUP.4.1'],
        outputs: [{ itemId: 'SUP-08-03' }],
        inputs: [{ itemId: 'MAN-08-01' }],
      },
      {
        id: 'SUP.4.BP2',
        name: { en: 'Conduct joint reviews', ja: 'ジョイントレビューを実施する' },
        description: {
          en: 'Conduct joint reviews at defined milestones and assess the status and products of project activities.',
          ja: '定義されたマイルストーンでジョイントレビューを実施し、プロジェクト活動の状況と成果物を評価する。',
        },
        supportsOutcomes: ['SUP.4.1', 'SUP.4.2'],
        outputs: [{ itemId: 'SUP-13-03' }],
        inputs: [{ itemId: 'SUP-08-03' }],
      },
      {
        id: 'SUP.4.BP3',
        name: { en: 'Track action items', ja: 'アクションアイテムを追跡する' },
        description: {
          en: 'Identify, track and manage action items resulting from joint reviews to closure.',
          ja: 'ジョイントレビューから生じたアクションアイテムを識別、追跡、管理してクローズまで追跡する。',
        },
        supportsOutcomes: ['SUP.4.3'],
        outputs: [{ itemId: 'SUP-13-03' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'SUP-08-03',
        name: { en: 'Review Plan', ja: 'レビュー計画' },
        characteristics: [
          { en: 'Review schedule and milestones', ja: 'レビュースケジュールとマイルストーン' },
          { en: 'Participants and objectives', ja: '参加者と目標' },
        ],
      },
      {
        id: 'SUP-13-03',
        name: { en: 'Review Record', ja: 'レビュー記録' },
        characteristics: [
          { en: 'Review results and decisions', ja: 'レビュー結果と決定事項' },
          { en: 'Action items and status', ja: 'アクションアイテムと状況' },
        ],
      },
    ],
  },
  {
    id: 'SUP.7',
    name: {
      en: 'Documentation',
      ja: '文書化',
    },
    group: 'SUP',
    purpose: {
      en: 'The purpose of the Documentation Process is to develop and maintain the recorded information produced by a process.',
      ja: '文書化プロセスの目的は、プロセスによって生成される記録された情報を開発・維持することである。',
    },
    outcomes: [
      {
        id: 'SUP.7.1',
        description: {
          en: 'A documentation strategy identifying the documents to be produced is defined.',
          ja: '作成すべき文書を識別する文書化戦略が定義されている。',
        },
      },
      {
        id: 'SUP.7.2',
        description: {
          en: 'Documents are developed and made available according to the documentation strategy.',
          ja: '文書が文書化戦略に従って開発され、利用可能となっている。',
        },
      },
      {
        id: 'SUP.7.3',
        description: {
          en: 'Documents are maintained to reflect the current status of the development.',
          ja: '文書が開発の現在の状況を反映するように維持されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SUP.7.BP1',
        name: { en: 'Define documentation strategy', ja: '文書化戦略を定義する' },
        description: {
          en: 'Define a documentation strategy identifying all documents to be produced, their format, and applicable standards.',
          ja: '作成すべきすべての文書、そのフォーマット、適用可能な標準を識別する文書化戦略を定義する。',
        },
        supportsOutcomes: ['SUP.7.1'],
        outputs: [{ itemId: 'SUP-08-04' }],
        inputs: [{ itemId: 'MAN-08-01' }],
      },
      {
        id: 'SUP.7.BP2',
        name: { en: 'Develop and maintain documents', ja: '文書を開発・維持する' },
        description: {
          en: 'Develop documents according to the documentation strategy and maintain them to reflect current status.',
          ja: '文書化戦略に従って文書を開発し、現在の状況を反映するように維持する。',
        },
        supportsOutcomes: ['SUP.7.2', 'SUP.7.3'],
        outputs: [{ itemId: 'SUP-08-04' }],
        inputs: [{ itemId: 'SUP-08-04' }],
      },
    ],
    outputItems: [
      {
        id: 'SUP-08-04',
        name: { en: 'Documentation Plan / Documents', ja: '文書化計画 / 文書' },
        characteristics: [
          { en: 'Document list and standards', ja: '文書一覧と標準' },
          { en: 'Document status and version', ja: '文書状況とバージョン' },
        ],
      },
    ],
  },
  {
    id: 'SUP.8',
    name: {
      en: 'Configuration Management',
      ja: '構成管理',
    },
    group: 'SUP',
    purpose: {
      en: 'The purpose of the Configuration Management Process is to establish and maintain the integrity of all the work products of a process or project and make them available to concerned parties.',
      ja: '構成管理プロセスの目的は、プロセスまたはプロジェクトのすべての成果物の完全性を確立・維持し、関係者が利用できるようにすることである。',
    },
    outcomes: [
      {
        id: 'SUP.8.1',
        description: {
          en: 'A configuration management strategy is defined.',
          ja: '構成管理戦略が定義されている。',
        },
      },
      {
        id: 'SUP.8.2',
        description: {
          en: 'Items to be controlled are identified, defined and baselined.',
          ja: '管理すべきアイテムが識別、定義され、ベースライン化されている。',
        },
      },
      {
        id: 'SUP.8.3',
        description: {
          en: 'Changes to configuration items are controlled.',
          ja: '構成アイテムへの変更が管理されている。',
        },
      },
      {
        id: 'SUP.8.4',
        description: {
          en: 'The status of the configuration items and changes is recorded and reported.',
          ja: '構成アイテムと変更の状況が記録・報告されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SUP.8.BP1',
        name: { en: 'Define configuration management strategy', ja: '構成管理戦略を定義する' },
        description: {
          en: 'Define a configuration management strategy covering configuration identification, control, status accounting, and audit.',
          ja: '構成識別、管理、状況記録、監査を網羅する構成管理戦略を定義する。',
        },
        supportsOutcomes: ['SUP.8.1'],
        outputs: [{ itemId: 'SUP-08-05' }],
        inputs: [{ itemId: 'MAN-08-01' }],
      },
      {
        id: 'SUP.8.BP2',
        name: { en: 'Identify and baseline configuration items', ja: '構成アイテムを識別してベースライン化する' },
        description: {
          en: 'Identify items to be placed under configuration control and establish baselines at defined milestones.',
          ja: '構成管理下に置くアイテムを識別し、定義されたマイルストーンでベースラインを確立する。',
        },
        supportsOutcomes: ['SUP.8.2'],
        outputs: [{ itemId: 'SUP-13-04' }],
        inputs: [{ itemId: 'SUP-08-05' }],
      },
      {
        id: 'SUP.8.BP3',
        name: { en: 'Control changes to configuration items', ja: '構成アイテムへの変更を管理する' },
        description: {
          en: 'Control changes to configuration items using change management procedures.',
          ja: '変更管理手順を使用して構成アイテムへの変更を管理する。',
        },
        supportsOutcomes: ['SUP.8.3'],
        outputs: [{ itemId: 'SUP-13-04' }],
        inputs: [],
      },
      {
        id: 'SUP.8.BP4',
        name: { en: 'Report configuration status', ja: '構成状況を報告する' },
        description: {
          en: 'Record and report the status of configuration items and changes.',
          ja: '構成アイテムと変更の状況を記録・報告する。',
        },
        supportsOutcomes: ['SUP.8.4'],
        outputs: [{ itemId: 'SUP-13-04' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'SUP-08-05',
        name: { en: 'Configuration Management Plan', ja: '構成管理計画' },
        characteristics: [
          { en: 'Configuration identification scheme', ja: '構成識別スキーム' },
          { en: 'Baseline definitions', ja: 'ベースライン定義' },
        ],
      },
      {
        id: 'SUP-13-04',
        name: { en: 'Configuration Management Records', ja: '構成管理記録' },
        characteristics: [
          { en: 'Baseline records', ja: 'ベースライン記録' },
          { en: 'Change history', ja: '変更履歴' },
        ],
      },
    ],
  },
  {
    id: 'SUP.9',
    name: {
      en: 'Problem Resolution Management',
      ja: '問題解決管理',
    },
    group: 'SUP',
    purpose: {
      en: 'The purpose of the Problem Resolution Management Process is to ensure that problems are identified, analysed, managed, and controlled to resolution.',
      ja: '問題解決管理プロセスの目的は、問題が識別、分析、管理され、解決まで管理されることを確保することである。',
    },
    outcomes: [
      {
        id: 'SUP.9.1',
        description: {
          en: 'A problem resolution management strategy is defined.',
          ja: '問題解決管理戦略が定義されている。',
        },
      },
      {
        id: 'SUP.9.2',
        description: {
          en: 'Problems are recorded, identified, classified, and prioritised.',
          ja: '問題が記録、識別、分類、優先順位付けされている。',
        },
      },
      {
        id: 'SUP.9.3',
        description: {
          en: 'Problems are analysed and resolved.',
          ja: '問題が分析・解決されている。',
        },
      },
      {
        id: 'SUP.9.4',
        description: {
          en: 'Problems are tracked to closure.',
          ja: '問題がクローズまで追跡されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SUP.9.BP1',
        name: { en: 'Define problem resolution management strategy', ja: '問題解決管理戦略を定義する' },
        description: {
          en: 'Define a strategy for problem resolution management including problem recording, classification, and escalation.',
          ja: '問題記録、分類、エスカレーションを含む問題解決管理戦略を定義する。',
        },
        supportsOutcomes: ['SUP.9.1'],
        outputs: [{ itemId: 'SUP-08-06' }],
        inputs: [{ itemId: 'MAN-08-01' }],
      },
      {
        id: 'SUP.9.BP2',
        name: { en: 'Record and classify problems', ja: '問題を記録・分類する' },
        description: {
          en: 'Record, identify, classify, and prioritise problems when they are detected.',
          ja: '問題が検出された際に記録、識別、分類、優先順位付けを行う。',
        },
        supportsOutcomes: ['SUP.9.2'],
        outputs: [{ itemId: 'SUP-13-05' }],
        inputs: [{ itemId: 'SUP-08-06' }],
      },
      {
        id: 'SUP.9.BP3',
        name: { en: 'Analyse and resolve problems', ja: '問題を分析・解決する' },
        description: {
          en: 'Analyse problems to identify root causes and implement resolution actions.',
          ja: '根本原因を識別するために問題を分析し、解決処置を実施する。',
        },
        supportsOutcomes: ['SUP.9.3'],
        outputs: [{ itemId: 'SUP-13-05' }],
        inputs: [],
      },
      {
        id: 'SUP.9.BP4',
        name: { en: 'Track problems to closure', ja: '問題をクローズまで追跡する' },
        description: {
          en: 'Track problems and their resolution status to closure.',
          ja: '問題とその解決状況をクローズまで追跡する。',
        },
        supportsOutcomes: ['SUP.9.4'],
        outputs: [{ itemId: 'SUP-13-05' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'SUP-08-06',
        name: { en: 'Problem Resolution Management Plan', ja: '問題解決管理計画' },
        characteristics: [
          { en: 'Problem classification scheme', ja: '問題分類スキーム' },
          { en: 'Escalation procedures', ja: 'エスカレーション手順' },
        ],
      },
      {
        id: 'SUP-13-05',
        name: { en: 'Problem Record', ja: '問題記録' },
        characteristics: [
          { en: 'Problem description and classification', ja: '問題の説明と分類' },
          { en: 'Resolution actions and status', ja: '解決処置と状況' },
        ],
      },
    ],
  },
  {
    id: 'SUP.10',
    name: {
      en: 'Change Request Management',
      ja: '変更要求管理',
    },
    group: 'SUP',
    purpose: {
      en: 'The purpose of the Change Request Management Process is to ensure that change requests are managed, tracked, implemented and controlled.',
      ja: '変更要求管理プロセスの目的は、変更要求が管理、追跡、実施、管理されることを確保することである。',
    },
    outcomes: [
      {
        id: 'SUP.10.1',
        description: {
          en: 'A change request management strategy is defined.',
          ja: '変更要求管理戦略が定義されている。',
        },
      },
      {
        id: 'SUP.10.2',
        description: {
          en: 'Change requests are recorded and identified.',
          ja: '変更要求が記録・識別されている。',
        },
      },
      {
        id: 'SUP.10.3',
        description: {
          en: 'Change requests are analysed and the impact of the change is assessed.',
          ja: '変更要求が分析され、変更の影響が評価されている。',
        },
      },
      {
        id: 'SUP.10.4',
        description: {
          en: 'Changes are implemented, verified, and tracked to closure.',
          ja: '変更が実施、検証され、クローズまで追跡されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SUP.10.BP1',
        name: { en: 'Define change request management strategy', ja: '変更要求管理戦略を定義する' },
        description: {
          en: 'Define a strategy for change request management including change recording, analysis, approval, and tracking.',
          ja: '変更記録、分析、承認、追跡を含む変更要求管理戦略を定義する。',
        },
        supportsOutcomes: ['SUP.10.1'],
        outputs: [{ itemId: 'SUP-08-07' }],
        inputs: [{ itemId: 'MAN-08-01' }],
      },
      {
        id: 'SUP.10.BP2',
        name: { en: 'Record and classify change requests', ja: '変更要求を記録・分類する' },
        description: {
          en: 'Record and uniquely identify all change requests.',
          ja: 'すべての変更要求を記録し、一意に識別する。',
        },
        supportsOutcomes: ['SUP.10.2'],
        outputs: [{ itemId: 'SUP-13-06' }],
        inputs: [{ itemId: 'SUP-08-07' }],
      },
      {
        id: 'SUP.10.BP3',
        name: { en: 'Analyse and assess change requests', ja: '変更要求を分析・評価する' },
        description: {
          en: 'Analyse change requests and assess their impact on existing work products and project plans.',
          ja: '変更要求を分析し、既存の成果物とプロジェクト計画への影響を評価する。',
        },
        supportsOutcomes: ['SUP.10.3'],
        outputs: [{ itemId: 'SUP-13-06' }],
        inputs: [],
      },
      {
        id: 'SUP.10.BP4',
        name: { en: 'Implement and track change requests', ja: '変更要求を実施・追跡する' },
        description: {
          en: 'Implement approved change requests, verify the changes, and track to closure.',
          ja: '承認された変更要求を実施し、変更を検証してクローズまで追跡する。',
        },
        supportsOutcomes: ['SUP.10.4'],
        outputs: [{ itemId: 'SUP-13-06' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: 'SUP-08-07',
        name: { en: 'Change Request Management Plan', ja: '変更要求管理計画' },
        characteristics: [
          { en: 'Change recording and classification scheme', ja: '変更記録と分類スキーム' },
          { en: 'Approval and tracking procedures', ja: '承認と追跡手順' },
        ],
      },
      {
        id: 'SUP-13-06',
        name: { en: 'Change Request Records', ja: '変更要求記録' },
        characteristics: [
          { en: 'Change request description and status', ja: '変更要求の説明と状況' },
          { en: 'Impact analysis results', ja: '影響分析結果' },
        ],
      },
    ],
  },
]
