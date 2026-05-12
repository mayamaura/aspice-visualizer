import type { Process } from '../../types/aspice'

export const SYS_PROCESSES: Process[] = [
  {
    id: 'SYS.1',
    name: {
      en: 'Requirements Elicitation',
      ja: '要件引き出し',
    },
    group: 'SYS',
    purpose: {
      en: 'The purpose of the Requirements Elicitation Process is to gather, process, and track evolving stakeholder needs and requirements throughout the lifecycle of the product and/or service to establish a requirements baseline that serves as the basis for defining the needed work products.',
      ja: '要件引き出しプロセスの目的は、製品および/またはサービスのライフサイクル全体にわたって、進化するステークホルダーのニーズと要件を収集、処理、追跡し、必要な成果物を定義するための基礎となる要件ベースラインを確立することである。',
    },
    outcomes: [
      {
        id: 'SYS.1.1',
        description: {
          en: 'Stakeholders and their needs are identified.',
          ja: 'ステークホルダーとそのニーズが識別されている。',
        },
      },
      {
        id: 'SYS.1.2',
        description: {
          en: 'Stakeholder requirements are defined and documented.',
          ja: 'ステークホルダー要件が定義され、文書化されている。',
        },
      },
      {
        id: 'SYS.1.3',
        description: {
          en: 'Agreement on stakeholder requirements is achieved.',
          ja: 'ステークホルダー要件に関する合意が達成されている。',
        },
      },
      {
        id: 'SYS.1.4',
        description: {
          en: 'Changes to stakeholder requirements are managed.',
          ja: 'ステークホルダー要件への変更が管理されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SYS.1.BP1',
        name: { en: 'Obtain stakeholder requirements and requests', ja: 'ステークホルダー要件および要望を取得する' },
        description: {
          en: 'Obtain and document stakeholder requirements and requests from all relevant stakeholders.',
          ja: 'すべての関連するステークホルダーからステークホルダー要件および要望を取得し文書化する。',
        },
        supportsOutcomes: ['SYS.1.1', 'SYS.1.2'],
        outputs: [{ itemId: '17-12' }],
        inputs: [],
      },
      {
        id: 'SYS.1.BP2',
        name: { en: 'Understand stakeholder expectations', ja: 'ステークホルダーの期待を理解する' },
        description: {
          en: 'Analyse and understand stakeholder expectations and resolve conflicts between stakeholder requirements.',
          ja: 'ステークホルダーの期待を分析・理解し、ステークホルダー要件間の矛盾を解決する。',
        },
        supportsOutcomes: ['SYS.1.2'],
        outputs: [{ itemId: '17-12' }],
        inputs: [],
      },
      {
        id: 'SYS.1.BP3',
        name: { en: 'Agree on stakeholder requirements', ja: 'ステークホルダー要件に合意する' },
        description: {
          en: 'Agree on the stakeholder requirements with all relevant stakeholders.',
          ja: 'すべての関連するステークホルダーとステークホルダー要件に合意する。',
        },
        supportsOutcomes: ['SYS.1.3'],
        outputs: [{ itemId: '17-12' }],
        inputs: [],
      },
      {
        id: 'SYS.1.BP4',
        name: { en: 'Manage changes to stakeholder requirements', ja: 'ステークホルダー要件への変更を管理する' },
        description: {
          en: 'Manage changes to stakeholder requirements including impact analysis.',
          ja: '影響分析を含むステークホルダー要件への変更を管理する。',
        },
        supportsOutcomes: ['SYS.1.4'],
        outputs: [{ itemId: '17-12' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: '17-12',
        name: { en: 'Stakeholder Requirements', ja: 'ステークホルダー要件' },
        characteristics: [
          { en: 'Stakeholder needs and expectations', ja: 'ステークホルダーのニーズと期待' },
          { en: 'Agreed requirements', ja: '合意された要件' },
        ],
      },
    ],
  },
  {
    id: 'SYS.2',
    name: {
      en: 'System Requirements Analysis',
      ja: 'システム要件分析',
    },
    group: 'SYS',
    purpose: {
      en: 'The purpose of the System Requirements Analysis Process is to transform the stakeholder requirements into a set of system requirements that will guide the design of the system.',
      ja: 'システム要件分析プロセスの目的は、ステークホルダー要件をシステムの設計を導くシステム要件の集合に変換することである。',
    },
    outcomes: [
      {
        id: 'SYS.2.1',
        description: {
          en: 'System requirements, including interfaces, are defined.',
          ja: 'インターフェースを含むシステム要件が定義されている。',
        },
      },
      {
        id: 'SYS.2.2',
        description: {
          en: 'System requirements are categorised and analysed for correctness and testability.',
          ja: 'システム要件が分類され、正確性とテスト可能性について分析されている。',
        },
      },
      {
        id: 'SYS.2.3',
        description: {
          en: 'Consistency and bilateral traceability are established between stakeholder requirements and system requirements.',
          ja: 'ステークホルダー要件とシステム要件の間で、一貫性および双方向トレーサビリティが確立されている。',
        },
      },
      {
        id: 'SYS.2.4',
        description: {
          en: 'System requirements are agreed and communicated to all affected parties.',
          ja: 'システム要件が合意され、影響を受けるすべての関係者に伝達されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SYS.2.BP1',
        name: { en: 'Specify system requirements', ja: 'システム要件を規定する' },
        description: {
          en: 'Use the stakeholder requirements as the basis for system requirements. Specify functional and non-functional system requirements including interfaces.',
          ja: 'ステークホルダー要件をシステム要件の基礎として使用する。インターフェースを含む機能的および非機能的システム要件を規定する。',
        },
        supportsOutcomes: ['SYS.2.1'],
        outputs: [{ itemId: '17-11' }],
        inputs: [{ itemId: '17-12' }],
      },
      {
        id: 'SYS.2.BP2',
        name: { en: 'Structure system requirements', ja: 'システム要件を構造化する' },
        description: {
          en: 'Structure the system requirements in a hierarchical manner.',
          ja: 'システム要件を階層的に構造化する。',
        },
        supportsOutcomes: ['SYS.2.1'],
        outputs: [{ itemId: '17-11' }],
        inputs: [],
      },
      {
        id: 'SYS.2.BP3',
        name: { en: 'Analyse system requirements', ja: 'システム要件を分析する' },
        description: {
          en: 'Analyse the specified system requirements to ensure correctness, completeness, unambiguity, consistency, and testability.',
          ja: '規定されたシステム要件を分析し、正確性、完全性、明確性、一貫性、テスト可能性を確保する。',
        },
        supportsOutcomes: ['SYS.2.2'],
        outputs: [{ itemId: '17-11' }],
        inputs: [],
      },
      {
        id: 'SYS.2.BP4',
        name: { en: 'Establish traceability', ja: 'トレーサビリティを確立する' },
        description: {
          en: 'Establish bilateral traceability between stakeholder requirements and system requirements.',
          ja: 'ステークホルダー要件とシステム要件の間で双方向トレーサビリティを確立する。',
        },
        supportsOutcomes: ['SYS.2.3'],
        outputs: [{ itemId: '15-01' }],
        inputs: [{ itemId: '17-12' }],
      },
      {
        id: 'SYS.2.BP5',
        name: { en: 'Communicate agreed system requirements', ja: '合意されたシステム要件を伝達する' },
        description: {
          en: 'Communicate the agreed system requirements to all affected parties.',
          ja: '合意されたシステム要件を影響を受けるすべての関係者に伝達する。',
        },
        supportsOutcomes: ['SYS.2.4'],
        outputs: [],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: '17-11',
        name: { en: 'System Requirements Specification', ja: 'システム要件仕様' },
        characteristics: [
          { en: 'Functional requirements', ja: '機能要件' },
          { en: 'Non-functional requirements', ja: '非機能要件' },
          { en: 'Interface requirements', ja: 'インターフェース要件' },
        ],
      },
    ],
  },
  {
    id: 'SYS.3',
    name: {
      en: 'System Architectural Design',
      ja: 'システムアーキテクチャ設計',
    },
    group: 'SYS',
    purpose: {
      en: 'The purpose of the System Architectural Design Process is to establish a system architectural design and to identify which system requirements are to be allocated to which elements of the system.',
      ja: 'システムアーキテクチャ設計プロセスの目的は、システムアーキテクチャ設計を確立し、どのシステム要件をシステムのどの要素に割り当てるかを識別することである。',
    },
    outcomes: [
      {
        id: 'SYS.3.1',
        description: {
          en: 'A system architectural design is defined identifying the elements of the system.',
          ja: 'システムの要素を識別するシステムアーキテクチャ設計が定義されている。',
        },
      },
      {
        id: 'SYS.3.2',
        description: {
          en: 'System requirements are allocated to the elements of the system architecture.',
          ja: 'システム要件がシステムアーキテクチャの要素に割り当てられている。',
        },
      },
      {
        id: 'SYS.3.3',
        description: {
          en: 'Interfaces between system elements and with external entities are defined.',
          ja: 'システム要素間および外部エンティティとのインターフェースが定義されている。',
        },
      },
      {
        id: 'SYS.3.4',
        description: {
          en: 'Consistency and bilateral traceability are established between the system requirements and the system architectural design.',
          ja: 'システム要件とシステムアーキテクチャ設計の間で、一貫性および双方向トレーサビリティが確立されている。',
        },
      },
      {
        id: 'SYS.3.5',
        description: {
          en: 'The system architectural design is agreed and communicated to all affected parties.',
          ja: 'システムアーキテクチャ設計が合意され、影響を受けるすべての関係者に伝達されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SYS.3.BP1',
        name: { en: 'Develop system architectural design', ja: 'システムアーキテクチャ設計を開発する' },
        description: {
          en: 'Develop a system architectural design that identifies the major elements of the system and describes their responsibilities, characteristics and interactions.',
          ja: 'システムの主要な要素を識別し、その責務、特性、相互作用を記述するシステムアーキテクチャ設計を開発する。',
        },
        supportsOutcomes: ['SYS.3.1'],
        outputs: [{ itemId: '04-07' }],
        inputs: [{ itemId: '17-11' }],
      },
      {
        id: 'SYS.3.BP2',
        name: { en: 'Allocate system requirements', ja: 'システム要件を割り当てる' },
        description: {
          en: 'Allocate all system requirements to the elements of the system architecture.',
          ja: 'すべてのシステム要件をシステムアーキテクチャの要素に割り当てる。',
        },
        supportsOutcomes: ['SYS.3.2'],
        outputs: [{ itemId: '04-07' }],
        inputs: [{ itemId: '17-11' }],
      },
      {
        id: 'SYS.3.BP3',
        name: { en: 'Define interfaces of system elements', ja: 'システム要素のインターフェースを定義する' },
        description: {
          en: 'Identify, define and document the interfaces of each system element and external interfaces.',
          ja: '各システム要素のインターフェースおよび外部インターフェースを識別、定義、文書化する。',
        },
        supportsOutcomes: ['SYS.3.3'],
        outputs: [{ itemId: '04-07' }],
        inputs: [],
      },
      {
        id: 'SYS.3.BP4',
        name: { en: 'Establish traceability', ja: 'トレーサビリティを確立する' },
        description: {
          en: 'Establish bilateral traceability between system requirements and the system architectural design.',
          ja: 'システム要件とシステムアーキテクチャ設計の間で双方向トレーサビリティを確立する。',
        },
        supportsOutcomes: ['SYS.3.4'],
        outputs: [{ itemId: '15-01' }],
        inputs: [{ itemId: '17-11' }],
      },
      {
        id: 'SYS.3.BP5',
        name: { en: 'Communicate agreed system architectural design', ja: '合意されたシステムアーキテクチャ設計を伝達する' },
        description: {
          en: 'Communicate the agreed system architectural design to all affected parties.',
          ja: '合意されたシステムアーキテクチャ設計を影響を受けるすべての関係者に伝達する。',
        },
        supportsOutcomes: ['SYS.3.5'],
        outputs: [],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: '04-07',
        name: { en: 'System Architectural Design', ja: 'システムアーキテクチャ設計' },
        characteristics: [
          { en: 'System elements and responsibilities', ja: 'システム要素と責務' },
          { en: 'Interface definitions', ja: 'インターフェース定義' },
          { en: 'Requirements allocation', ja: '要件の割り当て' },
        ],
      },
    ],
  },
  {
    id: 'SYS.4',
    name: {
      en: 'System Integration and Integration Test',
      ja: 'システム統合および統合テスト',
    },
    group: 'SYS',
    purpose: {
      en: 'The purpose of the System Integration and Integration Test Process is to integrate the system elements into a complete system consistent with the system architectural design, and to ensure that the integrated system items are tested to provide evidence for compliance with the system architectural design.',
      ja: 'システム統合および統合テストプロセスの目的は、システムアーキテクチャ設計と一貫した形でシステム要素を統合して完全なシステムを構築し、統合されたシステムアイテムがシステムアーキテクチャ設計への準拠の証拠を提供するためにテストされることを確保することである。',
    },
    outcomes: [
      {
        id: 'SYS.4.1',
        description: {
          en: 'A system integration strategy consistent with the system architectural design is developed.',
          ja: 'システムアーキテクチャ設計と一貫したシステム統合戦略が開発されている。',
        },
      },
      {
        id: 'SYS.4.2',
        description: {
          en: 'A system integration test strategy including regression test strategy is developed.',
          ja: 'リグレッションテスト戦略を含むシステム統合テスト戦略が開発されている。',
        },
      },
      {
        id: 'SYS.4.3',
        description: {
          en: 'System elements are integrated according to the integration strategy.',
          ja: 'システム要素が統合戦略に従って統合されている。',
        },
      },
      {
        id: 'SYS.4.4',
        description: {
          en: 'Integration test criteria are defined based on the system architectural design.',
          ja: '統合テスト基準がシステムアーキテクチャ設計に基づいて定義されている。',
        },
      },
      {
        id: 'SYS.4.5',
        description: {
          en: 'Integrated system items are tested using the defined integration test criteria.',
          ja: '統合されたシステムアイテムが定義された統合テスト基準を用いてテストされている。',
        },
      },
      {
        id: 'SYS.4.6',
        description: {
          en: 'Consistency and bilateral traceability are established between the integration test specification and the system architectural design.',
          ja: '統合テスト仕様とシステムアーキテクチャ設計の間で、一貫性および双方向トレーサビリティが確立されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SYS.4.BP1',
        name: { en: 'Develop system integration strategy', ja: 'システム統合戦略を開発する' },
        description: {
          en: 'Develop a strategy for integration of system elements consistent with the system architectural design.',
          ja: 'システムアーキテクチャ設計と一貫したシステム要素の統合戦略を開発する。',
        },
        supportsOutcomes: ['SYS.4.1'],
        outputs: [{ itemId: '11-08' }],
        inputs: [{ itemId: '04-07' }],
      },
      {
        id: 'SYS.4.BP2',
        name: { en: 'Develop system integration test specification', ja: 'システム統合テスト仕様を開発する' },
        description: {
          en: 'Develop system integration test specification including test cases based on the system architectural design.',
          ja: 'システムアーキテクチャ設計に基づいたテストケースを含むシステム統合テスト仕様を開発する。',
        },
        supportsOutcomes: ['SYS.4.2', 'SYS.4.4'],
        outputs: [{ itemId: '11-08' }],
        inputs: [{ itemId: '04-07' }],
      },
      {
        id: 'SYS.4.BP3',
        name: { en: 'Integrate system elements', ja: 'システム要素を統合する' },
        description: {
          en: 'Integrate system elements according to the integration strategy.',
          ja: '統合戦略に従ってシステム要素を統合する。',
        },
        supportsOutcomes: ['SYS.4.3'],
        outputs: [{ itemId: '14-08' }],
        inputs: [{ itemId: '11-08' }],
      },
      {
        id: 'SYS.4.BP4',
        name: { en: 'Perform system integration test', ja: 'システム統合テストを実施する' },
        description: {
          en: 'Test integrated system items using the system integration test specification.',
          ja: 'システム統合テスト仕様を用いて統合されたシステムアイテムをテストする。',
        },
        supportsOutcomes: ['SYS.4.5'],
        outputs: [{ itemId: '13-04' }],
        inputs: [{ itemId: '14-08' }, { itemId: '11-08' }],
      },
      {
        id: 'SYS.4.BP5',
        name: { en: 'Establish traceability', ja: 'トレーサビリティを確立する' },
        description: {
          en: 'Establish bilateral traceability between the integration test specification and the system architectural design.',
          ja: '統合テスト仕様とシステムアーキテクチャ設計の間で双方向トレーサビリティを確立する。',
        },
        supportsOutcomes: ['SYS.4.6'],
        outputs: [{ itemId: '15-01' }],
        inputs: [{ itemId: '04-07' }],
      },
    ],
    outputItems: [
      {
        id: '11-08',
        name: { en: 'System Integration Test Specification', ja: 'システム統合テスト仕様' },
        characteristics: [
          { en: 'Integration test cases', ja: '統合テストケース' },
          { en: 'Regression test strategy', ja: 'リグレッションテスト戦略' },
        ],
      },
      {
        id: '14-08',
        name: { en: 'Integrated System', ja: '統合済みシステム' },
        characteristics: [
          { en: 'System elements integrated per architecture', ja: 'アーキテクチャに従い統合されたシステム要素' },
        ],
      },
    ],
  },
  {
    id: 'SYS.5',
    name: {
      en: 'System Qualification Test',
      ja: 'システム適格性確認テスト',
    },
    group: 'SYS',
    purpose: {
      en: 'The purpose of the System Qualification Test Process is to ensure that the integrated system is tested to provide evidence for compliance of the system with the system requirements and that the system is ready for delivery.',
      ja: 'システム適格性確認テストプロセスの目的は、統合されたシステムがシステム要件に準拠していることの証拠を提供するためにテストされ、システムが納入準備完了であることを確保することである。',
    },
    outcomes: [
      {
        id: 'SYS.5.1',
        description: {
          en: 'A system qualification test strategy including regression test strategy is developed.',
          ja: 'リグレッションテスト戦略を含むシステム適格性確認テスト戦略が開発されている。',
        },
      },
      {
        id: 'SYS.5.2',
        description: {
          en: 'System qualification test criteria are defined based on the system requirements.',
          ja: 'システム適格性確認テスト基準がシステム要件に基づいて定義されている。',
        },
      },
      {
        id: 'SYS.5.3',
        description: {
          en: 'The integrated system is tested using the defined system qualification test criteria.',
          ja: '統合されたシステムが定義されたシステム適格性確認テスト基準を用いてテストされている。',
        },
      },
      {
        id: 'SYS.5.4',
        description: {
          en: 'Consistency and bilateral traceability are established between the system qualification test specification and the system requirements.',
          ja: 'システム適格性確認テスト仕様とシステム要件の間で、一貫性および双方向トレーサビリティが確立されている。',
        },
      },
      {
        id: 'SYS.5.5',
        description: {
          en: 'Results of the system qualification test are recorded.',
          ja: 'システム適格性確認テストの結果が記録されている。',
        },
      },
    ],
    basePractices: [
      {
        id: 'SYS.5.BP1',
        name: { en: 'Develop system qualification test strategy', ja: 'システム適格性確認テスト戦略を開発する' },
        description: {
          en: 'Develop a strategy for system qualification testing including regression test strategy.',
          ja: 'リグレッションテスト戦略を含むシステム適格性確認テスト戦略を開発する。',
        },
        supportsOutcomes: ['SYS.5.1'],
        outputs: [{ itemId: '11-09' }],
        inputs: [{ itemId: '17-11' }],
      },
      {
        id: 'SYS.5.BP2',
        name: { en: 'Develop system qualification test specification', ja: 'システム適格性確認テスト仕様を開発する' },
        description: {
          en: 'Develop system qualification test specification including test cases based on the system requirements.',
          ja: 'システム要件に基づいたテストケースを含むシステム適格性確認テスト仕様を開発する。',
        },
        supportsOutcomes: ['SYS.5.2'],
        outputs: [{ itemId: '11-09' }],
        inputs: [{ itemId: '17-11' }],
      },
      {
        id: 'SYS.5.BP3',
        name: { en: 'Perform system qualification test', ja: 'システム適格性確認テストを実施する' },
        description: {
          en: 'Test the integrated system using the system qualification test specification.',
          ja: 'システム適格性確認テスト仕様を用いて統合されたシステムをテストする。',
        },
        supportsOutcomes: ['SYS.5.3'],
        outputs: [{ itemId: '13-04' }],
        inputs: [{ itemId: '14-08' }, { itemId: '11-09' }],
      },
      {
        id: 'SYS.5.BP4',
        name: { en: 'Establish traceability', ja: 'トレーサビリティを確立する' },
        description: {
          en: 'Establish bilateral traceability between the system qualification test specification and the system requirements.',
          ja: 'システム適格性確認テスト仕様とシステム要件の間で双方向トレーサビリティを確立する。',
        },
        supportsOutcomes: ['SYS.5.4'],
        outputs: [{ itemId: '15-01' }],
        inputs: [{ itemId: '17-11' }],
      },
      {
        id: 'SYS.5.BP5',
        name: { en: 'Record system qualification test results', ja: 'システム適格性確認テスト結果を記録する' },
        description: {
          en: 'Record the system qualification test results including pass/fail status.',
          ja: 'パス/フェイルのステータスを含むシステム適格性確認テスト結果を記録する。',
        },
        supportsOutcomes: ['SYS.5.5'],
        outputs: [{ itemId: '13-04' }],
        inputs: [],
      },
    ],
    outputItems: [
      {
        id: '11-09',
        name: { en: 'System Qualification Test Specification', ja: 'システム適格性確認テスト仕様' },
        characteristics: [
          { en: 'Test cases based on system requirements', ja: 'システム要件に基づくテストケース' },
          { en: 'Regression test strategy', ja: 'リグレッションテスト戦略' },
        ],
      },
    ],
  },
]
