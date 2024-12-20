package com.comet.opik.domain;

import com.comet.opik.api.AutomationRuleEvaluator;
import com.comet.opik.api.AutomationRuleEvaluatorUpdate;
import com.comet.opik.infrastructure.db.UUIDArgumentFactory;
import org.jdbi.v3.sqlobject.config.RegisterArgumentFactory;
import org.jdbi.v3.sqlobject.config.RegisterConstructorMapper;
import org.jdbi.v3.sqlobject.config.RegisterRowMapper;
import org.jdbi.v3.sqlobject.customizer.AllowUnusedBindings;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindList;
import org.jdbi.v3.sqlobject.customizer.BindMethods;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.jdbi.v3.stringtemplate4.UseStringTemplateEngine;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RegisterArgumentFactory(UUIDArgumentFactory.class)
@RegisterRowMapper(AutomationRuleRowMapper.class)
@RegisterConstructorMapper(AutomationRuleEvaluator.class)
public interface AutomationRuleEvaluatorDAO extends AutomationRuleDAO {

    @SqlUpdate("INSERT INTO automation_rule_evaluators(id, `type`, sampling_rate, code) "+
               "VALUES (:rule.id, :rule.type, :rule.samplingRate, :rule.code)")
    void save(@BindMethods("rule") AutomationRuleEvaluator rule);

    @SqlUpdate("""
            UPDATE automation_rule_evaluators
            SET sampling_rate = :rule.samplingRate,
                code = :rule.code
            WHERE id = :id
            """)
    int update(@Bind("id") UUID id, @BindMethods("rule") AutomationRuleEvaluatorUpdate ruleUpdate);

    @SqlQuery("""
            SELECT rule.id, rule.project_id, rule.action, evaluator.type, evaluator.sampling_rate, evaluator.code, rule.created_at, rule.created_by, rule.last_updated_at, rule.last_updated_by
            FROM automation_rules rule
            JOIN automation_rule_evaluators evaluator
              ON rule.id = evaluator.id
            WHERE `action` = 'evaluator'
            AND workspace_id = :workspaceId AND project_id = :projectId AND rule.id = :id
            """)
    Optional<AutomationRuleEvaluator> findById(@Bind("id") UUID id,
                                               @Bind("projectId") UUID projectId,
                                               @Bind("workspaceId") String workspaceId);

    @SqlQuery("""
            SELECT rule.id, rule.project_id, rule.action, evaluator.type, evaluator.sampling_rate, evaluator.code, rule.created_at, rule.created_by, rule.last_updated_at, rule.last_updated_by
            FROM automation_rules rule
            JOIN automation_rule_evaluators evaluator
              ON rule.id = evaluator.id
            WHERE `action` = 'evaluator'
            AND workspace_id = :workspaceId AND project_id = :projectId
            """)
    List<AutomationRuleEvaluator> findByProjectId(@Bind("projectId") UUID projectId, @Bind("workspaceId") String workspaceId);

    @SqlQuery("""
            SELECT rule.id, rule.project_id, rule.action, evaluator.type, evaluator.sampling_rate, evaluator.code, rule.created_at, rule.created_by, rule.last_updated_at, rule.last_updated_by
            FROM automation_rules rule
            JOIN automation_rule_evaluators evaluator
              ON rule.id = evaluator.id
            WHERE `action` = 'evaluator'
            AND workspace_id = :workspaceId AND project_id = :projectId
            LIMIT :limit OFFSET :offset 
            """)
    @AllowUnusedBindings
    List<AutomationRuleEvaluator> find(@Bind("limit") int limit, @Bind("offset") int offset,
            @Bind("projectId") UUID projectId, @Bind("workspaceId") String workspaceId);

    @SqlQuery("""
            SELECT COUNT(*)
            FROM automation_rules rule
            JOIN automation_rule_evaluators evaluator
              ON rule.id = evaluator.id
            WHERE `action` = 'evaluator'
            AND workspace_id = :workspaceId AND project_id = :projectId
            """)
    long findCount(@Bind("projectId") UUID projectId, @Bind("workspaceId") String workspaceId);

}
