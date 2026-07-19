import {
  ChevronDown,
  ChevronRight,
  UserCog,
} from "lucide-react";
import { useState } from "react";

import type { OrganizationEmployee } from "../types";

interface OrganizationNodeProps {
  employee: OrganizationEmployee;
  level?: number;
  canManage: boolean;
  onManage: (
    employee: OrganizationEmployee
  ) => void;
}

const OrganizationNode = ({
  employee,
  level = 0,
  canManage,
  onManage,
}: OrganizationNodeProps) => {
  const [expanded, setExpanded] =
    useState(true);

  const hasReportees =
    employee.reportees &&
    employee.reportees.length > 0;

  return (
    <div className="min-w-0">
      {/* Employee card */}
      <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-5 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-200 dark:hover:shadow-md">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Employee information */}
          <div className="flex min-w-0 items-start gap-2 sm:items-center sm:gap-4">
            {/* Expand button */}
            {hasReportees ? (
              <button
                type="button"
                onClick={() =>
                  setExpanded(
                    (current) => !current
                  )
                }
                aria-label={
                  expanded
                    ? "Collapse reportees"
                    : "Expand reportees"
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-500"
              >
                {expanded ? (
                  <ChevronDown size={19} />
                ) : (
                  <ChevronRight size={19} />
                )}
              </button>
            ) : (
              <div className="hidden w-8 shrink-0 sm:block" />
            )}

            {/* Profile image */}
            {employee.profileImage ? (
              <img
                src={employee.profileImage}
                alt={employee.name}
                className="h-10 w-10 shrink-0 rounded-xl object-cover sm:h-12 sm:w-12"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700 sm:h-12 sm:w-12 sm:text-lg dark:bg-indigo-950/50 dark:text-indigo-500">
                {employee.name
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            {/* Employee details */}
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <h3 className="min-w-0 break-words font-bold text-slate-900 sm:text-base dark:text-white">
                  {employee.name}
                </h3>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:text-xs ${
                    employee.status ===
                    "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-500"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {employee.status}
                </span>
              </div>

              <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">
                {employee.designation}
              </p>

              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 dark:text-slate-500 sm:text-sm">
                <span>
                  {employee.employeeId}
                </span>

                <span>
                  {employee.department}
                </span>

                <span>
                  {employee.reportees
                    ?.length || 0}{" "}
                  direct report
                  {employee.reportees
                    ?.length === 1
                    ? ""
                    : "s"}
                </span>
              </div>
            </div>
          </div>

          {/* Manage button */}
          {canManage && (
            <button
              type="button"
              onClick={() =>
                onManage(employee)
              }
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-200 dark:hover:bg-indigo-50 dark:hover:text-indigo-700"
            >
              <UserCog size={17} />
              Manage
            </button>
          )}
        </div>
      </div>

      {/* Child employees */}
      {hasReportees && expanded && (
        <div
          className={`mt-3 border-l-2 border-slate-200 dark:border-slate-700 pt-1 ${
            level === 0
              ? "ml-3 pl-2 sm:ml-6 sm:pl-4"
              : "ml-2 pl-2 sm:ml-6 sm:pl-4"
          }`}
        >
          <div className="space-y-3 sm:space-y-4">
            {employee.reportees.map(
              (reportee) => (
                <OrganizationNode
                  key={reportee._id}
                  employee={reportee}
                  level={level + 1}
                  canManage={canManage}
                  onManage={onManage}
                />
              )
            )}
          </div>
        </div> 
      )}
    </div>
  );
};

export default OrganizationNode;