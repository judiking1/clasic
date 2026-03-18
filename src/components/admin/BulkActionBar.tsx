"use client";

import { useState, useCallback } from "react";

interface BulkAction {
  label: string;
  value: string;
  variant?: "default" | "danger" | "warning";
}

interface BulkActionBarProps {
  selectedCount: number;
  onDelete: () => void | Promise<void>;
  onDeselect: () => void;
  onAction?: (action: string) => void | Promise<void>;
  actions?: BulkAction[];
}

export default function BulkActionBar({
  selectedCount,
  onDelete,
  onDeselect,
  onAction,
  actions = [],
}: BulkActionBarProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  }, [onDelete]);

  const handleCancelDelete = useCallback(() => {
    setShowConfirm(false);
  }, []);

  const handleAction = useCallback(
    async (actionValue: string) => {
      if (onAction) {
        await onAction(actionValue);
      }
    },
    [onAction]
  );

  const variantClasses = (variant?: string) => {
    switch (variant) {
      case "danger":
        return "bg-red-500 text-white hover:bg-red-600";
      case "warning":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      default:
        return "bg-gray-600 text-white hover:bg-gray-700";
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-900">
          {selectedCount}건 선택됨
        </span>
        <button
          type="button"
          onClick={onDeselect}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          선택 해제
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Custom action buttons */}
        {actions.map((action) => (
          <button
            key={action.value}
            type="button"
            onClick={() => handleAction(action.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${variantClasses(action.variant)}`}
          >
            {action.label}
          </button>
        ))}

        {/* Delete button / confirm dialog */}
        {!showConfirm ? (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition-colors"
          >
            삭제
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-1.5">
            <span className="text-sm text-red-700">
              {selectedCount}건을 삭제하시겠습니까?
            </span>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="rounded bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? "삭제 중..." : "확인"}
            </button>
            <button
              type="button"
              onClick={handleCancelDelete}
              disabled={isDeleting}
              className="rounded bg-white px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
