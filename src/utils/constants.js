export const STATUS_OPTIONS = [
  'APPLIED',
  'OA',
  'INTERVIEW',
  'REJECTED',
  'OFFER',
  'GHOSTED',
]

export const SOURCE_OPTIONS = [
  'LINKEDIN',
  'NAUKRI',
  'REFERRAL',
  'COMPANY_SITE',
  'INSTAHYRE',
  'OTHER',
]

export const AI_FEATURES = [
  {
    key: 'resume-improver',
    label: 'Resume Improver',
    endpoint: '/api/ai/resume-improver',
  },
  {
    key: 'jd-analyzer',
    label: 'JD Analyzer',
    endpoint: '/api/ai/jd-analyzer',
  },
  {
    key: 'interview-questions',
    label: 'Interview Questions',
    endpoint: '/api/ai/interview-questions',
  },
]
