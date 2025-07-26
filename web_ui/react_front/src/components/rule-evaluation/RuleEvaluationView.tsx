'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  RefreshCw,
  Search,
  Filter,
  Target,
  Code,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/hooks/use-toast'
import { ruleEvaluationApi } from '@/utils/api'
import type { RuleEvaluation } from '@/types'
import { cn } from '@/lib/utils'

export function RuleEvaluationView() {
  const [ruleList, setRuleList] = useState<string[]>([])
  const [selectedRule, setSelectedRule] = useState<string | null>(null)
  const [evaluation, setEvaluation] = useState<RuleEvaluation | null>(null)
  const [loading, setLoading] = useState(false)
  const [listLoading, setListLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showRawRule, setShowRawRule] = useState(false)

  useEffect(() => {
    loadRuleList()
  }, [])

  const loadRuleList = async () => {
    try {
      setListLoading(true)
      const rules = await ruleEvaluationApi.listRules()
      setRuleList(rules)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch rule list. Please check your connection.",
        variant: "destructive"
      })
    } finally {
      setListLoading(false)
    }
  }

  const loadEvaluation = async (ruleId: string) => {
    try {
      setLoading(true)
      setSelectedRule(ruleId)
      setEvaluation(null)
      
      const result = await ruleEvaluationApi.getRuleEvaluation(ruleId)
      setEvaluation(result)
      
      toast({
        title: "Success",
        description: `Loaded evaluation for ${ruleId}`,
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch evaluation. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredRules = ruleList.filter(rule => 
    rule.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSectionIcon = (type: 'summary' | 'gap' | 'recommendation') => {
    switch (type) {
      case 'summary':
        return <FileText className="h-5 w-5 text-blue-400" />
      case 'gap':
        return <AlertTriangle className="h-5 w-5 text-amber-400" />
      case 'recommendation':
        return <Brain className="h-5 w-5 text-purple-400" />
    }
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <Brain className="h-10 w-10 text-purple-400" />
              LLM Rule Evaluations
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
              AI-powered Sigma rule analysis and optimization recommendations
            </p>
          </div>
          <Button
            onClick={loadRuleList}
            disabled={listLoading}
            className="flex items-center gap-2"
            variant="outline"
          >
            <RefreshCw className={cn("h-4 w-4", listLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Rule List Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-4"
        >
          <Card className="glass-effect border-slate-700/40 h-fit">
            <CardHeader className="pb-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white font-semibold">
                    Available Rules
                  </CardTitle>
                  <Badge variant="secondary" className="bg-slate-800/60">
                    {ruleList.length} rules
                  </Badge>
                </div>
                
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search rules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-2">
              {listLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                </div>
              ) : filteredRules.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  {searchTerm ? 'No rules match your search' : 'No rules available'}
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-1 pr-4">
                    {filteredRules.map((rule, index) => (
                      <motion.button
                        key={rule}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        onClick={() => loadEvaluation(rule)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg transition-all duration-200 border",
                          selectedRule === rule
                            ? "bg-blue-600/15 text-blue-400 border-blue-500/25"
                            : "bg-slate-800/30 text-slate-300 border-transparent hover:bg-slate-800/50 hover:text-white"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">
                            {rule}
                          </span>
                          {selectedRule === rule && (
                            <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Evaluation Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-8"
        >
          <Card className="glass-effect border-slate-700/40 h-fit">
            <CardHeader className="pb-4">
              <div className="space-y-1">
                <CardTitle className="text-xl text-white font-semibold">
                  Rule Evaluation
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {selectedRule ? `Analysis for ${selectedRule}` : 'Select a rule to view its evaluation'}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-12"
                  >
                    <div className="text-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
                      <p className="text-slate-400">Loading evaluation...</p>
                    </div>
                  </motion.div>
                ) : evaluation ? (
                  <motion.div
                    key="evaluation"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Summary Section */}
                    {evaluation.summary && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {getSectionIcon('summary')}
                          <h3 className="text-lg font-semibold text-white">Summary</h3>
                        </div>
                        <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
                          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                            {evaluation.summary}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Gap Analysis Section */}
                    {evaluation.gap_analysis && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {getSectionIcon('gap')}
                          <h3 className="text-lg font-semibold text-white">Gap Analysis</h3>
                        </div>
                        <div className="bg-amber-900/10 border border-amber-600/20 rounded-lg p-4">
                          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                            {evaluation.gap_analysis}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Recommendation Section */}
                    {evaluation.llm_recommendation && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {getSectionIcon('recommendation')}
                          <h3 className="text-lg font-semibold text-white">LLM Recommendation</h3>
                        </div>
                        <div className="bg-purple-900/10 border border-purple-600/20 rounded-lg p-4">
                          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                            {evaluation.llm_recommendation}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* MITRE ATT&CK Mapping Section */}
                    {evaluation.mitre_mapping && evaluation.mitre_mapping.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-green-400" />
                          <h3 className="text-lg font-semibold text-white">🎯 MITRE ATT&CK Mapping</h3>
                        </div>
                        <div className="bg-green-900/10 border border-green-600/20 rounded-lg p-4">
                          <div className="space-y-3">
                            {evaluation.mitre_mapping.map((mapping, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  <Badge variant="outline" className="bg-green-800/20 text-green-300 border-green-600/30">
                                    {mapping.tactic}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {mapping.techniques.map((technique) => (
                                    <Badge key={technique} variant="secondary" className="bg-slate-800/60 text-slate-300 font-mono text-xs">
                                      {technique}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Raw Rule Section */}
                    {evaluation.raw_rule && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Code className="h-5 w-5 text-orange-400" />
                            <h3 className="text-lg font-semibold text-white">📄 Raw Rule</h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowRawRule(!showRawRule)}
                            className="text-slate-400 hover:text-white"
                          >
                            {showRawRule ? (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                Hide
                              </>
                            ) : (
                              <>
                                <ChevronRight className="h-4 w-4 mr-1" />
                                Show
                              </>
                            )}
                          </Button>
                        </div>
                        
                        <AnimatePresence>
                          {showRawRule && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-orange-900/10 border border-orange-600/20 rounded-lg p-4">
                                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                                  {JSON.stringify(evaluation.raw_rule, null, 2)}
                                </pre>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Full Evaluation Fallback */}
                    {!evaluation.summary && !evaluation.gap_analysis && !evaluation.llm_recommendation && evaluation.evaluation && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-blue-400" />
                          <h3 className="text-lg font-semibold text-white">Full Evaluation</h3>
                        </div>
                        <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
                          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                            {evaluation.evaluation}
                          </pre>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-12"
                  >
                    <div className="text-center space-y-3">
                      <Brain className="h-12 w-12 text-slate-600 mx-auto" />
                      <div className="space-y-1">
                        <p className="text-slate-400 font-medium">Select a rule to view evaluation</p>
                        <p className="text-sm text-slate-500">Choose from the available rules on the left</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 